import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEditComponent } from '../category-edit/category-edit';


@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
    ],

    templateUrl: './category-list.page.html',
    styleUrl: './category-list.page.scss'
})
export class CategoryListComponent implements OnInit{
    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    constructor(
        private categoryService: CategoryService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(
            categories => this.dataSource.data = categories
        );
    
      
    }
     loadData(): void {
    this.categoryService.getCategories().subscribe(
      categories => this.dataSource.data = categories
    );
  }

    createCategory() {
        const dialogRef = this.dialog.open(CategoryEditComponent, {
            data: {}
        });
      

     dialogRef.afterClosed() .subscribe(result => {
        if (!result) return;
        this.ngOnInit();
     });
}
editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });
  }

  deleteCategory (category: Category) {
    this.categoryService.deleteCategory (category.id).subscribe(() => {
      this.loadData();
    })
  }
}


