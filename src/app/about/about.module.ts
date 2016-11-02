import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoklakAboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

import { FooterModule } from '../footer/footer.module';

@NgModule({
	imports: [
		CommonModule,

		LoklakAboutRoutingModule,
		FooterModule
	],
	declarations: [
		AboutComponent
	]
})
export class AboutModule { }
