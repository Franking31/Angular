import { Component } from "@angular/core";
import { CommonModule } from "@angular/common"; // Import explicite de CommonModule
import { FormsModule } from "@angular/forms";   // Import explicite de FormsModule
import { UserSevice } from "../../../services/user.service";

// Interface pour typage
interface User {
  username: string;
  email: string;
  password: string;
}

@Component({
    selector: 'app-user',
    standalone: true, // Composant autonome
    imports: [CommonModule, FormsModule], 
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
})
export class UserComponent {
    user: User = { username: '', email: '', password: '' }; // Typage explicite
    message: string = ''; // Typage explicite
    
    constructor(private userService: UserSevice) {} // Correction cohérente avec l'import

    registerUser() {
        this.userService.register(this.user).subscribe(
            (response: any) => { // Typage temporaire
                this.message = 'Utilisateur créé avec succès!';
            },
            (error: any) => { // Typage temporaire
                this.message = 'Erreur lors de la création de l’utilisateur.';
            }
        );
    }
}