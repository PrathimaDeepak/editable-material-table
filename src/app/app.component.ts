import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: TableRow[] = [
  {id: 1, name: 'Rahul', email: 'abc@gmail.com'},
  {id: 2, name: 'Anjali', email: 'anjali@gmail.com'}
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  dataSource = new MatTableDataSource<TableRow>(ELEMENT_DATA);
  isAnyRowEditing = false;
  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumns: string[] = ['id', 'name', 'email', 'actions']; // Add other column names

  // Define whether a row is in editing mode or not
  editingRow: { [key: number]: boolean } = {};

  ngOnInit(): void {
    this.dataSource.data.forEach(row => this.editingRow[row.id] = false);
  }

  toggleEdit(row: TableRow): void {
    if (!this.isAnyRowEditing && !this.isEditing(row)) {
      this.editingRow[row.id] = true;
    } else {
      this.editingRow[row.id] = false;
    }
    this.isAnyRowEditing = this.checkIfAnyRowEditing();
  }

  // Check if a row is in editing mode
  isEditing(row: TableRow): boolean {
    return this.editingRow[row.id];
  }

  // Handle input changes during editing
  onEditInputChange(event: any, row: any, columnName: any): void {
    row[columnName] = (event.target).textContent.trim();
    // Find the index of the edited row in the dataSource array

    const index = this.dataSource.data.findIndex(item  => item.id === row.id);

    if (index !== -1) {
      const updatedData = this.dataSource.data.slice();

      // Update the specific row in the copied array
      updatedData[index] = { ...row }; // Assuming 'id' is a unique identifier

      // Assign the updated array back to the MatTableDataSource's 'data'
      this.dataSource.data = updatedData;
    }
  }

  onSaveChanges(row: any) {
      this.editingRow[row.id] = false;
  }

  private checkIfAnyRowEditing(): boolean {
    return Object.keys(this.editingRow).some((key: string) => this.editingRow[parseInt(key, 10)]);
  }

  addNewRow(){
    const nextId = this.dataSource.data.length + 1; // Adjust the logic as needed
    const newRow: TableRow = { id: nextId, name: '', email: '' };

    this.dataSource.data.push(newRow);
    this.dataSource.data = [...this.dataSource.data]; // Refresh data source
    this.editingRow[newRow.id] = true; // Start editing the new row
  }

}

interface TableRow {
  id: number;
  name: string;
  email: string;
  // Other properties...
}
