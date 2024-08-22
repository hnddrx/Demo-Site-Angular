export class PayrollPeriod {
    constructor (
        public name: string,
        public company: string,
        public payroll_date: any,
        public approval_cutoff: any,
        public period_group: string,
        public attendance_from: string,
        public attendance_to: string
    ) {}
}
