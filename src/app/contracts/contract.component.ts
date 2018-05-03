import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PersonalData } from '../shared/PersonalData';
import { PersonalService } from '../services/personal.service';
import {Personal} from '../shared/Personal';
import {ContractService} from '../services/contract.service';
import {ContractData} from '../shared/ContractData';
import {Contract} from '../shared/Contract';
import {Router} from '@angular/router';
import {ContractDataParameters} from '../shared/ContractDataParameters';

@Component({
  selector: 'ssi-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  displayedColumns = ['Nombre', 'Apellido', 'Email', 'Direccion', 'Telefono', 'Accion'];
  dataSource: MatTableDataSource<ContractData>;
  contracts: ContractData[] = [];
  contract: Contract;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private contractService: ContractService, private router: Router, private contractDataParameters: ContractDataParameters) {

    this.loadDataTable();
  }

  ngOnInit() {
  }

  private loadDataTable(): void {
    this.contractService.getListContracts()
      .subscribe(this.processContractData.bind(this),
        this.processErrorData.bind(this));
  }

  initDatatable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  private processContractData(personal: any) {
    if ( personal.status === 'ok') {
      this.contracts = personal.data;
      this.dataSource = new MatTableDataSource(this.contracts);
      this.initDatatable();
    }
  }

  private processErrorData(err) {
    console.log(err);
  }

  // deletePersonal(personal: Personal): void {
  //
  //   this.contractService.deletePersonal(personal)
  //       .subscribe(this.loadDataTable.bind(this), this.processErrorData.bind(this));
  // }
  editContract(contract: Contract): void {

    // this.contractService.deletePersonal(personal)
    //     .subscribe(this.loadDataTable.bind(this), this.processErrorData.bind(this));

    this.contractDataParameters.contractUpdate = contract;

    this.router.navigate(['contracts/update']);
  }
}