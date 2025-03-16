import { Component } from "@angular/core";
import { CommonModule } from "@angular/common"; 
import { FormsModule } from "@angular/forms";   
import { UserSevice } from "../../services/user.service";
import { Router } from "@angular/router";

// Interface pour typage
interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginData: LoginData = { email: "", password: "" };
  message: string = "";
  loading: boolean = false;

  constructor(private userService: UserSevice, private router: Router) {}

  loginUser() {
    this.loading = true;
    this.userService.login(this.loginData).subscribe(
      (response: any) => {
        this.message = "Connexion réussie !";
        localStorage.setItem("token", response.token); // Stocker le token
        setTimeout(() => this.router.navigate(["/dashboard"]), 1000); // Redirection
      },
      (error: any) => {
        this.message = "Identifiants invalides.";
        this.loading = false;
      }
    );
  }
}
