import { NgModule } from '../../node_modules/@angular/core';
import {
    AccordionModule,
    ToolbarModule,
    ButtonModule,
    SidebarModule,
    SlideMenuModule,
    BreadcrumbModule,
    CardModule,
    PanelMenuModule,
    ChartModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    KeyFilterModule,
    ChipsModule,
    MultiSelectModule,
    SliderModule,
    ListboxModule,
    AutoCompleteModule,
    ScrollPanelModule,
    FieldsetModule,
    TabViewModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule,
    GalleriaModule,
    FileUploadModule,
    EditorModule,
    CalendarModule,
    GMapModule,
    ConfirmationService
} from 'primeng/primeng';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

const primeModule = [
    AccordionModule,
    ToolbarModule,
    ButtonModule,
    SidebarModule,
    SlideMenuModule,
    BreadcrumbModule,
    CardModule,
    PanelMenuModule,
    ChartModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    KeyFilterModule,
    ChipsModule,
    MultiSelectModule,
    SliderModule,
    ListboxModule,
    AutoCompleteModule,
    ScrollPanelModule,
    FieldsetModule,
    TabViewModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule,
    GalleriaModule,
    FileUploadModule,
    EditorModule,
    CalendarModule,
    GMapModule,
    ToastModule
];

@NgModule({
    exports: [...primeModule],
    imports: [...primeModule],
    declarations: [],
    providers: [ConfirmationService, MessageService]
})
export class PrimeModule { }
