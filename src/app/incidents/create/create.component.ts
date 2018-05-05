import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncidentService} from '../shared/incident.service';
import {AreaService} from '../../services/area.service';
import {PersonalService} from '../../services/personal.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ssi-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  id: number;
  incidentForm: FormGroup;
  areas: any[];
  personalList: any[];
  isUpdate = false;
  types = [
    'enfermedad', 'accidente', 'incidente'
  ];
  statusList = [
    'reportado', 'pendiente', 'entregado', 'rechazado'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private incidentService: IncidentService,
    private areaService: AreaService,
    private personalService: PersonalService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.createForm();
    }

  ngOnInit() {
    this.areaService.getAreaList()
      .subscribe((res) => {
        this.areas = res;
      }, (error) => {
        this.toastr.error(error, 'Ha ocurrido un error inesperado');
        console.log(error);
      });
    this.personalService.getListPersonals()
      .subscribe((res) => {
        this.personalList = res.data;
      }, (error) => {
        this.toastr.error(error, 'Ha ocurrido un error inesperado');
        console.log(error);
      });
    this.route.params.subscribe(params => {
      if (params.id !== undefined) {
        this.incidentService.getIncidentById(params.id)
          .subscribe((res) => {
            this.id = params.id;
            this.isUpdate = true;
            this.loadIncident(res.data);
          }, error => {
            console.log(error);
          });
      }
    });
  }

  createForm() {
    this.incidentForm = this.formBuilder.group({
      code: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      area: ['', Validators.required],
      reportedBy: ['', Validators.required],
      reincident: [''],
      treatment: [''],
      description: ['', Validators.required]
    });
  }

  saveData() {
    const data = {
      code: this.incidentForm.value.code,
      reportedBy: this.incidentForm.value.reportedBy,
      area: this.incidentForm.value.area,
      reincident: this.incidentForm.value.reincident,
      treatment: this.incidentForm.value.treatment,
      incidentNumber: 4,
      incidentTypeName: this.incidentForm.value.type,
      description: this.incidentForm.value.description,
      incidentSubType: '',
      status: this.incidentForm.value.status
    };
    if (!this.isUpdate) {
      this.incidentService.createNewIncident(data)
        .subscribe((incident: any) => {
          this.toastr.success('El incidente se guardo satisfactoriamente', incident.status);
        }, (error) => {
          console.log(error);
          this.toastr.error(error, 'Ha ocurrido un error inesperado');
        });
    } else {
      this.incidentService.updateIncident(data, this.id)
        .subscribe(response => {
          this.toastr.success('El incidente fue actualizado satisfactoriamente', response.status);
          this.router.navigateByUrl('/incidents');
        }, error => {
          console.log(error);
          this.toastr.error(error, 'Ha ocurrido un error inesperado');
        });
    }
    this.incidentForm.reset();
    const form: HTMLFormElement =
      <HTMLFormElement>document.getElementById('form');
    form.reset();
  }

  loadIncident(data: any) {
    this.incidentForm.patchValue({
      code: data.code,
      reportedBy: data.reportedBy,
      area: data.area,
      reincident: data.reincident,
      treatment: data.treatment,
      type: data.incidentType.incidentTypeName,
      description: data.incidentDetail.incidentDetailName,
      status: data.incidentDetail.incidentDetailStatus
    });
  }

  cancelForm() {
    this.incidentForm.reset();
    const form: HTMLFormElement =
      <HTMLFormElement>document.getElementById('form');
    form.reset();
  }
}
