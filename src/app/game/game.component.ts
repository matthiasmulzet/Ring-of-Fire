import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { update } from '@angular/fire/database';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { ShareGameComponent } from '../share-game/share-game.component';





@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  gameId: any;
  gameOver: boolean = false;



  constructor(private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore, public dialog: MatDialog) {
    this.game = new Game();
  }


  /**
   * loads the game
   */
  ngOnInit(): void {
    this.openDialog();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this
        .firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          this.setJsonElements(game);
        });
    });
  }


  setJsonElements(game: any) {
    this.game.currentPlayer = game.currentPlayer;
    this.game.player_images = game.player_images;
    this.game.playedCards = game.playedCards;
    this.game.players = game.players;
    this.game.stack = game.stack;
    this.game.pickCardAnimation = game.pickCardAnimation;
    this.game.currentCard = game.currentCard;
  }

  redirect() {
    this.router.navigate(['']);
  }


  takeCard() {
    if (this.min2Players()) {
      if (this.game.stack.length == 0) {
        this.gameOver = true;
        setTimeout(() => {
          this.redirect();
        }, 2000);
      }
      else if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop();
        this.game.pickCardAnimation = true;
        this.changeCurrentPlayer();
        this.saveGame();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 930);
      }
    }
  }

  min2Players() {
    return this.game.players.length >= 2
  }


  changeCurrentPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }


  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        }
        else
          this.game.player_images[playerId] = change;
        this.saveGame();
      }
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.webp');
        this.saveGame();
      }
    });
  }


  openShare(): void {
    this.dialog.open(ShareGameComponent)
  }


  saveGame() {
    this
      .firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());
  }
}




