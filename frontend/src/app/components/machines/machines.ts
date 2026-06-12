import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineService, Machine, CreateMachineRequest, UpdateMachineRequest } from '../../services/machine.service';

@Component({
  selector: 'app-machines',
  imports: [CommonModule, FormsModule],
  templateUrl: './machines.html',
  styleUrl: './machines.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class Machines implements OnInit {
  machines: Machine[] = [];
  loading = false;
  error = '';
  showForm = false;
  editingId: number | null = null;

  formData = {
    machineName: '',
    machineType: '',
    location: '',
    statusId: 1
  };

  machineStatuses = [
    { id: 1, name: 'working' },
    { id: 2, name: 'idle' },
    { id: 3, name: 'stopped' }
  ];

  constructor(
    private machineService: MachineService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    console.log('Machines constructor called');
  }

  ngOnInit(): void {
    console.log('Machines component initialized');
    this.loadMachines();
  }

  loadMachines(): void {
    console.log('loadMachines called');
    this.loading = true;
    this.error = '';
    this.machineService.getMachines().subscribe({
      next: (data) => {
        console.log('API response:', data);
        console.log('Setting loading to false');
        this.ngZone.run(() => {
          this.machines = data;
          this.loading = false;
          this.cdr.markForCheck();
          console.log('loading state:', this.loading);
          console.log('machines:', this.machines);
        });
      },
      error: (err) => {
        console.error('Error loading machines:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load machines';
          this.loading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.resetForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      machineName: '',
      machineType: '',
      location: '',
      statusId: 1
    };
  }

  editMachine(machine: Machine): void {
    this.editingId = machine.machineId;
    this.formData = {
      machineName: machine.machineName,
      machineType: machine.machineType || '',
      location: machine.location || '',
      statusId: machine.statusId
    };
    this.showForm = true;
  }

  saveMachine(): void {
    if (!this.formData.machineName.trim()) {
      this.error = 'Machine name is required';
      return;
    }

    const request: CreateMachineRequest | UpdateMachineRequest = {
      machineName: this.formData.machineName,
      machineType: this.formData.machineType || undefined,
      location: this.formData.location || undefined,
      statusId: this.formData.statusId
    };

    if (this.editingId) {
      // Update
      this.machineService.updateMachine(this.editingId, request as UpdateMachineRequest).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.loadMachines();
            this.closeForm();
            this.error = '';
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Error updating machine:', err);
          this.ngZone.run(() => {
            this.error = 'Failed to update machine';
            this.cdr.markForCheck();
          });
        }
      });
    } else {
      // Create
      this.machineService.createMachine(request as CreateMachineRequest).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.loadMachines();
            this.closeForm();
            this.error = '';
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Error creating machine:', err);
          this.ngZone.run(() => {
            this.error = 'Failed to create machine';
            this.cdr.markForCheck();
          });
        }
      });
    }
  }

  deleteMachine(id: number): void {
    if (confirm('Are you sure you want to delete this machine?')) {
      this.machineService.deleteMachine(id).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.loadMachines();
            this.error = '';
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Error deleting machine:', err);
          this.ngZone.run(() => {
            this.error = 'Failed to delete machine';
            this.cdr.markForCheck();
          });
        }
      });
    }
  }

  getStatusName(statusId: number): string {
    return this.machineStatuses.find(s => s.id === statusId)?.name || 'Unknown';
  }
}
