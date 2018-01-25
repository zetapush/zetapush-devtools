import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Feature modules
import { UiModule } from '../ui.module';

// Routing
import { AuthRoutingModule } from './auth-routing.module';

// Components
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule, FormsModule, AuthRoutingModule, UiModule],
  declarations: [LoginComponent],
})
export class AuthModule {}
