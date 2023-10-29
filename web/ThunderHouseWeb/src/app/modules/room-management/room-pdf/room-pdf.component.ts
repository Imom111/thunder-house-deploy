import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/services/login.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import jsPDF from 'jspdf';
import { RoomManagementService } from 'src/app/services/room-management.service';

@Component({
  selector: 'app-room-pdf',
  templateUrl: './room-pdf.component.html',
  styleUrls: ['./room-pdf.component.css']
})
export class RoomPdfComponent {
  customers1: any[] = [];

    customers2: any[] = [];

    customers3: any[] = [];

    selectedCustomers1: any[] = [];

    selectedCustomer: any = {};

    representatives: any[] = [];

    statuses: any[] = [];

    products: any[] = [];

    rowGroupMetadata: any;

    expandedRows: any = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    sizes :any= [];

    pdfDialog:boolean=false;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private customerService: LoginService, private productService: LoginService,private serviceRooms: RoomManagementService) { }

    ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => {
            this.customers1 = customers;
            this.loading = false;

            // @ts-ignore
            this.customers1.forEach(customer => customer.date = new Date(customer.date));
        });
        this.customerService.getCustomersMedium().then(customers => this.customers2 = customers);
        this.customerService.getCustomersLarge().then(customers => this.customers3 = customers);
        this.productService.getProductsWithOrdersSmall().then(data => this.products = data);

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'XuXue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];

        this.sizes = [
            { name: 'Small', class: 'p-datatable-sm' },
            { name: 'Normal', class: '' },
            { name: 'Large',  class: 'p-datatable-lg' }
        ];

        this.serviceRooms.exportPdfRooms$.subscribe((valuePDF)=>{
            this.pdfDialog=valuePDF;
        })
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                }
                else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    }
                    else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach(product => product && product.name ? this.expandedRows[product.name] = true : '');

        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: any): string {
        switch (status) {
            case 'unqualified':
                return 'danger';
    
            case 'qualified':
                return 'success';
    
            case 'new':
                return 'info';
    
            case 'negotiation':
                return 'warning';
    
            case 'renewal':
                return 'default'; // Provide a default value for unrecognized statuses.
    
            default:
                return 'default'; // Also handle the default case in case of undefined or other unexpected values.
        }
    }

    @ViewChild('content') content!: ElementRef;

    exportPDF() {
    const doc = new jsPDF({ format: 'letter' }); // Establece el formato de página a 'letter'

    const content = this.content.nativeElement;

    // Calcula la altura total del contenido
    const contentHeight = content.offsetHeight;

    // Configura la escala para ajustar el contenido al tamaño de la página
    const scaleFactor = doc.internal.pageSize.width / content.offsetWidth;

    doc.html(content, {
      callback: (pdf) => {
        pdf.save('exported-content.pdf');
      },
      html2canvas: {
        scale: scaleFactor, // Aplica la escala calculada
      },
    });

    this.pdfDialog=false;
    
  }

  cancelPDF(){
    this.pdfDialog=false;
  }

  openDialogPDF(){
    this.pdfDialog=true;

  }
    
}
