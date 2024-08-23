export class AttendanceRegister {
    constructor (
        public name: string,
        public employee: string,
        public employee_name: string,
        public target_date: string,
        public card_in: string | null,
        public card_out: string | null,
        public work_shift: string,
        public is_halfday: number,
        public is_absent: number,
        public is_lwop: number,
        public work: number
    ) {}
}
