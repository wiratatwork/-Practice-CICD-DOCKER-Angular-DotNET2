import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Machine {
    machineId: number;
    machineName: string;
    machineType?: string;
    location?: string;
    statusId: number;
    statusName: string;
}

export interface CreateMachineRequest {
    machineName: string;
    machineType?: string;
    location?: string;
    statusId: number;
}

export interface UpdateMachineRequest {
    machineName: string;
    machineType?: string;
    location?: string;
    statusId: number;
}

@Injectable({
    providedIn: 'root'
})
export class MachineService {
    private apiUrl = 'http://localhost:5001/api/machines';

    constructor(private http: HttpClient) { }

    getMachines(): Observable<Machine[]> {
        return this.http.get<Machine[]>(this.apiUrl);
    }

    getMachine(id: number): Observable<Machine> {
        return this.http.get<Machine>(`${this.apiUrl}/${id}`);
    }

    createMachine(request: CreateMachineRequest): Observable<Machine> {
        return this.http.post<Machine>(this.apiUrl, request);
    }

    updateMachine(id: number, request: UpdateMachineRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, request);
    }

    deleteMachine(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
