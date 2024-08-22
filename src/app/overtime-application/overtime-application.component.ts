import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { DocsExampleComponent } from '@docs-components/public-api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import {
  BorderDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  GutterDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TextColorDirective,
  GridModule
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import {
  InputGroupComponent, InputGroupTextDirective, FormControlDirective,
  FormLabelDirective, FormCheckInputDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective, FormSelectDirective
} from '@coreui/angular';

import { TableDirective, TableColorDirective, TableActiveDirective, AlignDirective } from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgForm, ReactiveFormsModule } from '@angular/forms';


import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  PopoverDirective,
  TooltipDirective
} from '@coreui/angular';

import { AppConfig } from 'src/_config/app-config';
import { GlobalApiService } from 'src/_service/global-api-service';

//NOTE: Model Import
import { Employee } from 'src/_model/employee';
import { Company } from 'src/_model/company';
import { PayrollPeriod } from 'src/_model/payroll-period';
import { AttendanceRegister } from 'src/_model/attendance-register'
import { WorkSchedule } from 'src/_model/work-schedule'
import { Table } from 'src/_model/table'
// Library Class
import { OvertimeApplication } from './overtime-application';

type CardColor = {
  color: string
  textColor?: string
}

@Component({
  
  selector: 'app-overtime-application',
  standalone: true,
  imports: [CommonModule, GridModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective,
    TabsComponent, TabsListComponent, IconDirective, TabDirective, TabsContentComponent, TabPanelComponent,
    InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective,
    FormCheckInputDirective, ThemeDirective,
    DropdownComponent, DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective, DropdownDividerDirective, FormSelectDirective,
    TableDirective, TableColorDirective, TableActiveDirective, AlignDirective, ReactiveFormsModule,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    PopoverDirective,
    MatProgressBarModule,
    TooltipDirective],

  templateUrl: './overtime-application.component.html',
  styleUrl: './overtime-application.component.scss',
  providers: [OvertimeApplication] // Provide it here if only needed in this component
})
export class OvertimeApplicationComponent implements OnInit {
  //TODO: Declare List 
  //NOTE: can call to  any functions
  companyList: Company[] = [];
  periodList: PayrollPeriod[] = [];
  employeeList: Employee[] = [];
  attendanceregisterList: AttendanceRegister[] = []
  worksheduleList: WorkSchedule[] = []
  tableList: Table[] = []

  //TODO: Declare variables/fields
  employee: string = ''
  company: string = ''
  payrollperiod: string = ''
  attendanceregister: string = ''
  workschedule: string = ''
  table: string = ''
 
  documentForm = new FormGroup({
    employee: new FormControl(''),
    company: new FormControl(''),
    payrollperiod: new FormControl(''),
    attendanceregister: new FormControl(''),
    workschedule: new FormControl(''),
    table: new FormControl('')
  });
  progress = 0
  constructor(
    private apiservice: GlobalApiService,
    private otapplication: OvertimeApplication,
    private http: HttpClient,) {

  }

  onDataChange(): void {

  }

  ngOnInit(): void {

    this.view();
  }

  async view() {
    try {
      // Fetch company data
        // Fetch payroll period data
      const res_payrol_period: any = await this.apiservice.getPNData('Payroll Period?fields=["name", "company", "attendance_from", "attendance_to"]&limit_page_length=0');
      this.periodList = res_payrol_period.data.map((v: any) => new PayrollPeriod(v.name, v.company, null, null, '', v.attendance_from, v.attendance_to));
      //console.log(this.periodList);
      
    } catch (error) {
      console.error('Error fetching data', error);
      throw error;
    }
  }
  
  
  filteredPeriods = this.periodList;
  filteredTable = this.tableList;
  
  isPeriodDropdownVisible = false;
  inputStatePeriod: 'danger' | 'warning' | 'normal' = 'normal';

  lastFocusedInput: 'company' | 'period' | 'employee' | null = null;

  filterList<T>(value: string, list: T[], keys: (keyof T)[]): T[] {
    if (!value) {
      return list; // Return the original list if the input value is empty
    }
    
    return list.filter(item =>
      keys.some(key => 
        item[key]?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
  }
  
  updateDropdownVisibility(list: Array<{ name: string }>, value: string): boolean {
    return list.length > 0 && value !== '';
  }
  

 
  onPeriodInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Filter the period list based on the input value
    this.filteredPeriods = this.filterList(value, this.periodList, ['name']);
    this.isPeriodDropdownVisible = this.updateDropdownVisibility(this.filteredPeriods, value);
    this.updateInputState('period', value); // Update input state
  }


  onPeriodSelect(name: string, selRow: {}) {
    //console.log(selRow)
    this.documentForm.get('payrollperiod')?.setValue(name);
    this.isPeriodDropdownVisible = false;
    this.inputStatePeriod = 'normal'; // Reset state to normal on selection
  }
  
  updateInputState(type: 'company' | 'period' | 'employee', value: string) {
    const list = this.filteredPeriods;

    if (value === '') {
    
        this.inputStatePeriod = 'normal';
      
    } else if (list.length === 0) {
     
        this.inputStatePeriod = 'danger';
      
    } else if (list.length > 1) {
     
        this.inputStatePeriod = 'warning';
      
    } else {
    
        this.inputStatePeriod = 'normal';
      
    }
  }
  
  onInputFocus(event: Event, type:   'period') {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    this.lastFocusedInput = type; // Track the last focused input

    if (type === 'period') {
      this.filteredPeriods = this.filterList(value, this.periodList, ['name']);
      // Show the dropdown even if the value is empty
      this.isPeriodDropdownVisible = value === '' || this.updateDropdownVisibility(this.filteredPeriods, value);
    }
  }
  
  onInputBlur(event: Event, type:   'period') {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Only update input state if the last focused input matches the current type
    if (this.lastFocusedInput === type) {
      this.updateInputState(type, value);
    }

    // Hide the dropdown
    setTimeout(() => {
  
        this.isPeriodDropdownVisible = false;
      
    }, 200);
  }

//TODO: This is where the data is processed
async ProcessData(data: { employee: string, company: string, payrollperiod: string }): Promise<void> {
  const showLoading = () => {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  };

  const showSuccess = () => {
    Swal.fire('Success!', 'Your operation was successful!', 'success');
  };

  const showError = (status: number) => {
    let title = 'Error!';
    let text = 'An unexpected error occurred. Please try again.';

    if (status === 417) {
      title = 'Notice';
      text = 'You already have an Overtime Application in place.';
    }

    Swal.fire({ title, text, icon: 'error' });
  };

  try {
    showLoading();

    // Fetch data
    const [res_company, res_employee, res_worksched, res_attreg] = await Promise.all([
      this.apiservice.getPNData('Company?limit_page_length=0'),
      this.apiservice.getPNData('Employee?fields=["name", "full_name", "company", "default_schedule"]&limit_page_length=0'),
      this.apiservice.getPNData('Work Shift?fields=["name", "time_in", "time_out", "work_shift_type"]&limit_page_length=0'),
      this.apiservice.getPNData('Attendance Register?fields=["name", "employee", "employee_name", "card_in", "card_out", "target_date", "work_shift"]&limit_page_length=0')
    ]);

    // Process data
    this.companyList = res_company.data.map((v: any) => new Company(v.name));
    this.employeeList = res_employee.data.map((v: any) => new Employee(v.name, v.full_name, v.company, v.default_schedule));
    this.worksheduleList = res_worksched.data.map((v: any) => new WorkSchedule(v.name, v.time_in, v.time_out, v.work_shift_type));
    this.attendanceregisterList = res_attreg.data.map((v: any) => new AttendanceRegister(v.name, v.employee, v.employee_name, v.card_in, v.card_out, v.target_date, v.work_shift));

    // Filter and process records
    const payPeriod = this.periodList.find(period => period.name === data.payrollperiod);
    if (!payPeriod) {
      console.error('Payroll period not found');
      return;
    }

    const attendanceReg = this.attendanceregisterList.filter(record => {
      const targetDate = new Date(record.target_date);
      return targetDate >= new Date(payPeriod.attendance_from) && targetDate <= new Date(payPeriod.attendance_to);
    });

    const results = attendanceReg.map(record => {
      const employee = this.employeeList.find(emp => emp.name === record.employee);
      const workShift = this.worksheduleList.find(ws => ws.name === record.work_shift);

      if (!employee || !workShift) {
        console.error('Employee or Work Shift not found');
        return null;
      }

      const datetime = `${record.target_date.split(' ')[0]} ${workShift.time_out}`;
      const date = new Date(datetime.replace(' ', 'T'));
      date.setHours(date.getHours() + 4);

      const formatDate = (date: Date) => ({
        year: date.getFullYear(),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        day: date.getDate().toString().padStart(2, '0'),
        hours: date.getHours().toString().padStart(2, '0'),
        minutes: date.getMinutes().toString().padStart(2, '0'),
        seconds: date.getSeconds().toString().padStart(2, '0'),
      });

      const { year, month, day, hours, minutes, seconds } = formatDate(date);
      const newFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      return {
        "doctype": "Overtime Application",
        "employee": record.employee,
        "employee_name": record.employee_name,
        "company": employee.company,
        "posting_date": new Date().toISOString().slice(0, 19).replace('T', ' '),
        "target_date": record.target_date.split(' ')[0],
        "is_previous": workShift.work_shift_type === 'Day' ? 0 : 1,
        "from_date": record.target_date.split(' ')[0],
        "from_time": workShift.time_out,
        "to_date": newFormat.split(' ')[0],
        "to_time": newFormat.split(' ')[1],
        "docstatus": 1,
        "workflow_state": "Approved",
        "automated": 1,
        "reason": "Automatically generated attendance processing using Angular",
        "linked_document": ""
      };
    }).filter(result => result !== null);

    this.tableList = results.map((v: any) => new Table(v.employee, v.employee_name, v.work_shift, v.company, v.from_date, v.from_time, v.to_date, v.to_time));

    // Post data
    const totalResults = results.length;
    let processedResults = 0;

    for (const result of results) {
      await this.apiservice.postData(result).toPromise();
      processedResults++;
      this.progress = (processedResults / totalResults) * 100;
    }

    showSuccess();

  } catch (error: any) {
    console.error('Error processing data:', error);
    showError(error.status); // Fallback to 500 if status is not available

  }
  finally{
    this.progress = 0
  }
}  
  
}
