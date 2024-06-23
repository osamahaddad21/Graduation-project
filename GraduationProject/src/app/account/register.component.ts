import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, PharmacyBranchesService, PharmacyService } from '@app/_services';
import { Pharmacy, PharmacyBranches } from '@app/_models';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private pharmacyService: PharmacyService,
        private pharmacyBranchesService : PharmacyBranchesService
    ) { }

    pharmacies:Pharmacy[];
    pharmacyBranches:PharmacyBranches[];
    selectedBranch;
    ngOnInit() {
        this.pharmacyService.getAll()
        .pipe(first())
        .subscribe(pharmacies => this.pharmacies = pharmacies);
        this.pharmacyBranchesService.getAll().pipe(first())
        .subscribe(pharmaciesBranches =>this.pharmacyBranches = pharmaciesBranches);
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            userName: ['', Validators.required],
            userRole: ['', Validators.required],
            userPharmacy: [''],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    GetPharmacyFullName(pharmacyBranch : PharmacyBranches){
        const pharmacy = this.pharmacies.find(p=>p.id ==  pharmacyBranch.pharmacyId);
        return pharmacy.name + "-" + pharmacyBranch.name ;
      }
      SelectBranch(event){
        const pharmacyBranchId = (event.target as HTMLSelectElement).value;
        this.selectedBranch=pharmacyBranchId
      }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
