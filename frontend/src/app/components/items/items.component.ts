import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, Item } from '../../services/item.service';

@Component({
    selector: 'app-items',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
    items: Item[] = [];
    newItem: Item = { id: 0, name: '', description: '' };
    editingId: number | null = null;

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.loadItems();
    }

    loadItems(): void {
        this.itemService.getItems().subscribe({
            next: (data) => this.items = data,
            error: (err) => console.error('Error loading items:', err)
        });
    }

    addItem(): void {
        if (!this.newItem.name.trim()) return;

        this.itemService.createItem(this.newItem).subscribe({
            next: () => {
                this.newItem = { id: 0, name: '', description: '' };
                this.loadItems();
            },
            error: (err) => console.error('Error adding item:', err)
        });
    }

    deleteItem(id: number): void {
        this.itemService.deleteItem(id).subscribe({
            next: () => this.loadItems(),
            error: (err) => console.error('Error deleting item:', err)
        });
    }

    editItem(item: Item): void {
        this.editingId = item.id;
        this.newItem = { ...item };
    }

    updateItem(): void {
        if (this.editingId !== null) {
            this.itemService.updateItem(this.editingId, this.newItem).subscribe({
                next: () => {
                    this.editingId = null;
                    this.newItem = { id: 0, name: '', description: '' };
                    this.loadItems();
                },
                error: (err) => console.error('Error updating item:', err)
            });
        }
    }

    cancel(): void {
        this.editingId = null;
        this.newItem = { id: 0, name: '', description: '' };
    }
}
