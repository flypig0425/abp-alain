import {
    Component,
    Injector,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    TemplateRef, OnInit,
} from '@angular/core';
import {
    NzTreeComponent,
    NzTreeNode,
    NzFormatEmitEvent,
    NzDropdownContextComponent,
    NzDropdownService,
    NzMenuItemDirective,
    NzModalService,
} from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    OrganizationUnitServiceProxy,
    ListResultDtoOfOrganizationUnitDto,
    OrganizationUnitDto,
} from '@shared/service-proxies/service-proxies';

import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { CreateOrEditUnitModalComponent } from './create-or-edit-unit-modal.component';
import { ArrayService } from '@delon/util';

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html',
    styleUrls: ['./organization-tree.component.less'],
})
export class OrganizationTreeComponent extends AppComponentBase implements OnInit {

    @Output() ouSelected = new EventEmitter<IBasicOrganizationUnitInfo>();

    totalUnitCount = 0;
    loading = false;
    nodes: any[] = [];
    selectedNode: NzTreeNode;

    private dropdown: NzDropdownContextComponent;
    private _nodesDto: OrganizationUnitDto[];

    constructor(private _element: ElementRef,
                injector: Injector,
                private _organizationUnitService: OrganizationUnitServiceProxy,
                private nzDropdownService: NzDropdownService,
                private arrayService: ArrayService,
                private _nzModalService: NzModalService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getTreeDataFromServer();
    }

    private getTreeDataFromServer() {
        this.loading = true;

        this._organizationUnitService.getOrganizationUnits().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
            this.totalUnitCount = result.items.length;
            this._nodesDto = result.items;

            this.refreshTree();

            this.loading = false;
        });
    }

    refreshTree(): void {
        this.nodes = this.arrayService.arrToTreeNode(this._nodesDto, {
            idMapName: 'id',
            parentIdMapName: 'parentId',
            titleMapName: 'displayName',
        });
    }

    mouseAction(name: string, e: NzFormatEmitEvent): void {
        console.log(name, e);
    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template);
    }


    close(e: NzMenuItemDirective): void {
        console.log(e);
        this.dropdown.close();
    }

    updateSelectedNode(node: NzTreeNode, e: NzFormatEmitEvent): void {

        this.selectedNode = node;

        if (node !== null) {
            this.ouSelected.emit({
                id: parseInt(node.key),
                displayName: node.title,
            });

        } else {
            this.ouSelected.emit(null);
        }
    }

    addUnit(node: NzTreeNode, e: NzFormatEmitEvent): void {
        this.updateSelectedNode(node, e);

        let title = this.l('NewOrganizationUnit');
        let modal = this._nzModalService.create({
            nzContent: CreateOrEditUnitModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {
                organizationUnit: {
                    parentId: node ? Number(node.key) : null,
                },
            },
            nzTitle: title,
            nzFooter: null,
        });

        modal.afterOpen.subscribe(() => {
            const instance = modal.getContentComponent();
            instance.unitCreated.subscribe((ou) => {
                this.unitCreated(ou);
            });
        });
    }

    editUnit(node: NzTreeNode, e: NzFormatEmitEvent): void {
        this.updateSelectedNode(node, e);

        let title = this.l('Edit') + ':' + node.title;
        let modal = this._nzModalService.create({
            nzContent: CreateOrEditUnitModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {
                organizationUnit: {
                    id: Number(node.key),
                    displayName: node.title,
                },
            },
            nzTitle: title,
            nzFooter: null,
        });

        modal.afterOpen.subscribe(() => {
            const instance = modal.getContentComponent();
            instance.unitUpdated.subscribe((ou) => {
                this.unitUpdated(ou);
            });
        });
    }

    deleteUnit(node: NzTreeNode, e: NzFormatEmitEvent): void {
        this.message.confirm(
            this.l('OrganizationUnitDeleteWarningMessage', node.title),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService.deleteOrganizationUnit(parseInt(node.key)).subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        let parent = node.getParentNode();
                        if (parent === null) {
                            this.nodes = this.nodes.filter(item => item !== node);
                        } else {
                            parent.children = parent.children.filter(item => item !== node);
                        }
                        this.updateSelectedNode(null, e);
                    });
                }
            },
        );
    }

    unitCreated(ou: OrganizationUnitDto): void {
        if (this.selectedNode === null) {
            this.nodes.push(new NzTreeNode({
                title: ou.displayName,
                key: ou.id.toString(),
                isLeaf: false,
                children: [],
            }));
        } else {
            let children = this.selectedNode.getChildren();
            if (children === null) {
                this.selectedNode.children = new Array<NzTreeNode>(new NzTreeNode({
                    title: ou.displayName,
                    key: ou.id.toString(),
                    isLeaf: true,
                    children: [],
                }, this.selectedNode));
            } else {
                children.push(new NzTreeNode({
                    title: ou.displayName,
                    key: ou.id.toString(),
                    isLeaf: true,
                    children: [],
                }, this.selectedNode));
            }
        }
    }

    unitUpdated(ou: OrganizationUnitDto): void {
        this.selectedNode.title = ou.displayName;
    }


}
