import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineService, Machine, CreateMachineRequest, UpdateMachineRequest, MachineStatus } from '../../services/machine.service';

@Component({
  selector: 'app-machines',
  imports: [CommonModule, FormsModule],
  templateUrl: './machines.html',
  styleUrl: './machines.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Machines implements OnInit {
  machines: Machine[] = [];
  allMachines: Machine[] = [];
  machineStatuses: MachineStatus[] = [];
  loading = false;
  error = '';
  showForm = false;
  editingId: number | null = null;
  searchQuery = '';

  formData = {
    machineName: '',
    machineType: '',
    location: '',
    statusId: 1
  };

  formErrors: { [key: string]: string } = {};

  constructor(
    private machineService: MachineService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    console.log('Machines constructor called');
  }

  ngOnInit(): void {
    console.log('Machines component initialized');
    this.loadMachineStatuses();
    this.loadMachines();
  }

  loadMachineStatuses(): void {
    this.machineService.getMachineStatuses().subscribe({
      next: (data) => {
        console.log('Machine statuses:', data);
        this.ngZone.run(() => {
          this.machineStatuses = data;
          // Set default statusId to first status
          if (this.machineStatuses.length > 0) {
            this.formData.statusId = this.machineStatuses[0].statusId;
          }
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('Error loading machine statuses:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load machine statuses';
          this.cdr.markForCheck();
        });
      }
    });
  }

  loadMachines(): void {
    console.log('loadMachines called');
    this.loading = true;
    this.error = '';
    this.machineService.getMachines().subscribe({
      next: (data) => {
        console.log('API response:', data);
        this.ngZone.run(() => {
          this.allMachines = data;
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

  searchMachines(): void {
    if (!this.searchQuery.trim()) {
      this.machines = this.allMachines;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.machineService.searchMachines(this.searchQuery).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.machines = data;
          this.loading = false;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('Error searching machines:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to search machines';
          this.loading = false;
          this.machines = [];
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
      statusId: this.machineStatuses.length > 0 ? this.machineStatuses[0].statusId : 1
    };
    this.formErrors = {};
  }

  validateForm(): boolean {
    this.formErrors = {};

    if (!this.formData.machineName.trim()) {
      this.formErrors['machineName'] = 'Machine Name is required';
    }

    if (!this.formData.machineType.trim()) {
      this.formErrors['machineType'] = 'Machine Type is required';
    }

    if (!this.formData.location.trim()) {
      this.formErrors['location'] = 'Location is required';
    }

    return Object.keys(this.formErrors).length === 0;
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
    if (!this.validateForm()) {
      this.error = '';
      this.cdr.markForCheck();
      return;
    }

    const request: CreateMachineRequest | UpdateMachineRequest = {
      machineName: this.formData.machineName.trim(),
      machineType: this.formData.machineType.trim(),
      location: this.formData.location.trim(),
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
            this.error = err.error?.error || 'Failed to update machine';
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
            this.error = err.error?.error || 'Failed to create machine';
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
    return this.machineStatuses.find(s => s.statusId === statusId)?.statusName || 'Unknown';
  }
}
