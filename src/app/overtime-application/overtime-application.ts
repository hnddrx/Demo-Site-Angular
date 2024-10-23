import { Injectable } from '@angular/core';
import { GlobalApiService } from '../../_service/global-api-service';
import { PayrollPeriod } from '../../_model/payroll-period';

@Injectable({
  providedIn: 'root' // Optional: Makes this service available application-wide
})
export class OvertimeApplication {


    fields = '["name", "company", "payroll_date", "approval_cutoff","period_group", "attendance_from", "attendance_to"]';
    constructor(private apiservice: GlobalApiService) { }


    async GetPayrollPeriodList(company: string = ''): Promise<PayrollPeriod[]> {
        let request: PayrollPeriod[] = [];
        try {
            const res_payrol_period = await this.apiservice.getPNData(
                `Payroll Period?fields=${this.fields}&filters=[["company","=","${company}"]]&limit_page_length=0`
            );

            if (res_payrol_period && res_payrol_period.data) {
                for (let v of res_payrol_period.data) {
                    let setPeriod = new PayrollPeriod(v.name, v.company, v.payroll_date, v.approval_cutoff, v.period_group, v.attendance_from, v.attendance_to);
                    request.push(setPeriod);
                }
            }
        } catch (error) {
            console.error('Error fetching payroll period list:', error);
        }
        return request;
    }


    // Return Only Single Row
    async GetPayrollPeriod(payroll_period: string = ''): Promise<PayrollPeriod | null> {
        try {
            const res_payrol_period = await this.apiservice.getPNData(
                `Payroll Period?fields=${this.fields}&filters=[["name","=","${payroll_period}"]]&limit_page_length=0`
            );

            if (res_payrol_period && res_payrol_period.data && res_payrol_period.data.length > 0) {
                const v = res_payrol_period.data[0]; // Get the first matching record
                return new PayrollPeriod(v.name, v.company, v.payroll_date, v.approval_cutoff, v.period_group, v.attendance_from, v.attendance_to);
            } else {
                return null; // No matching record found
            }
        } catch (error) {
            console.error('Error fetching payroll period:', error);
            return null; // Return null if there's an error
        }
    }

    
}
