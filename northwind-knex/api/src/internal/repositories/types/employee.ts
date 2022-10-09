export type Employee = {
    id: string;
    last_name: string;
    first_name: string | null;
    title: string;
    title_of_courtesy: string;
    birth_date: Date;
    hire_date: Date;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    home_phone: string;
    extension: number;
    notes: string;
    recipient_id: string | null;
}

export type EmployeeWithRecipient = Employee & {
    e_id: string,
    e_last_name: string,
    e_first_name: string,
}
