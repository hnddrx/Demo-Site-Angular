export class AttendanceRegister {
    constructor (
        public name: string,
        public employee: String,
        public employee_name: string,
        public target_date: string,
        public card_in: any,
        public card_out: any,
        public work_shift: any
    ) {}
}
