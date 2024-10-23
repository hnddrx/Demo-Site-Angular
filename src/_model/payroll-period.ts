export class PayrollPeriod {
    constructor (
        public name: string,
        public company: string,
        public payroll_date: string | null,
        public approval_cutoff: string | null,
        public period_group: string | null,
        public attendance_from: string,
        public attendance_to: string
    ) {}
}
