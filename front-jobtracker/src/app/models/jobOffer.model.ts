export enum JobStatus {
    WISHLIST = 'WISHLIST',
    APPLIED = 'APPLIED',
    INTERVIEW = 'INTERVIEW',
    OFFER = 'OFFER',
    REJECTED = 'REJECTED'
}

export enum Response {
    PENDING = 'PENDING',
    YES = 'YES',
    NO = 'NO'
}
export enum RemoteWork {
    NONE = 'NONE',
    PARTIAL = 'PARTIAL',
    OCCASIONAL = 'OCCASIONAL'
}

export interface JobOffer {
    id?: string; // Optionnel car absent lors de la création côté frontend
    title: string;
    company: string;
    location?: string;
    offerUrl: string;
    salary?: number;
    contactName?: string;
    status: JobStatus;
    contacted: boolean;
    response: Response;
    remoteWork?: RemoteWork;
    applicationDate: string;
    notes?: string;
}
