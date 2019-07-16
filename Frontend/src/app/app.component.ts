import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('Authorization', 'my-auth-token')
  .set('Content-Type', 'application/json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  username: string = '';
  userTokens: string[] = [];

  text = "Era una luminosa e fredda giornata d'aprile, e gli orologi battevano tredici colpi. Winston Smith, tentando di evitare le terribili raffiche di vento col mento affondato nel petto, scivolò in fretta dietro le porte di vetro degli Appartamenti Vittoria: non così in fretta tuttavia, da impedire che una folata di polvere sabbiosa entrasse con lui. L'ingresso emanava un lezzo di cavolo bollito e di vecchi e logori stoini. A una delle estremità era attaccato un manifesto a colori, troppo grande per poter essere messo all'interno. Vi era raffigurato solo un volto enorme, grande più di un metro, il volto di un uomo di circa quarantacinque anni, con folti baffi neri e lineamenti severi ma belli. Winston si diresse verso le scale. Tentare con l'ascensore, infatti, era inutile. Perfino nei giorni migliori funzionava raramente e al momento, in ossequio alla campagna economica in preparazione della Settimana dell'Odio, durante le ore diurne l'erogazione della corrente elettrica veniva interrotta."
  htmlText = "<div>" + this.text + "</div>"
  tokenList: string[];

  constructor(public http: HttpClient) {
    //Cache text
    let onlyLetterText: string = this.text.replace(/[^a-zA-Z ]/g, ""); //Keep only letters
    this.tokenList = onlyLetterText.split(" ");
  }

  onKey(event: any) { // without type info
    this.username = event.target.value;
  }


  get() {
    if (this.username == '') {
      alert("Name should not be empty!");
      return;
    }

    this.getToken().subscribe((res: any) => {
      this.userTokens = res || [];
      for (let token of this.userTokens)
        this.highlightToken(token);
    });
  }


  save() {
    if (this.username == '') {
      alert("Name should not be empty!");
      return;
    }

    let selectedText: string = window.getSelection()
      .toString()
      .trim() //Remove spaces before and after
      .replace(/[^a-zA-Z ]/g, ""); //Keep only letters

    let selectedTextNoSpaces: string = selectedText.split(" ")[0];
    if (selectedTextNoSpaces === "")
      return;

    let tokenFound: string;
    for (let token of this.tokenList) {
      if (token.includes(selectedTextNoSpaces)) {
        tokenFound = token;
        break;
      }
    }

    if (tokenFound == undefined || this.userTokens.includes(tokenFound))
      return;

    this.userTokens.push(tokenFound);
    this.highlightToken(tokenFound);

    this.saveToken().subscribe((res: any) => {
      console.log("Token saved: " + tokenFound);
    });
  }

  delete(tokentoDelete: string) {
    this.userTokens.splice(this.userTokens.indexOf(tokentoDelete), 1);

    //Reset text highlight
    this.htmlText = "<div>" + this.text + "</div>";
    for (let token of this.userTokens)
      this.highlightToken(token);

    this.saveToken().subscribe((res: any) => {
      console.log("Token deleted");
    });
  }

  highlightToken(tokenFound: string) {
    let partialText: string[] = this.htmlText.split(tokenFound);
    if (partialText.length == 2)
      this.htmlText = partialText[0] + "<b>" + tokenFound + "</b>" + partialText[1];
  }


  getToken() {
    return this.http.post<any>(
      "http://localhost:3000/gettokens",
      { username: this.username },
      { headers: headers }
    );
  }


  saveToken(): Observable<any> {
    return this.http.post<any>(
      "http://localhost:3000/savetokens",
      { username: this.username, userTokens: Array.from(this.userTokens || []) },
      { headers: headers }
    );
  }


}
