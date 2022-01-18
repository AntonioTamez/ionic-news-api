//primero los que vienen de angular, despues lo de ionic
import { Component, Input, OnInit } from '@angular/core';
import { Platform , ActionSheetController,  ActionSheetButton} from '@ionic/angular';

//despues plugins de terceros
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

//despues mi codigo
import { StorageService } from '../../services/storage.service';
import { Article } from '../../interfaces';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

@Input() article: Article;
@Input() index: number;

 
  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
    ) { }

  ngOnInit() {}

  openArticle() {
    if(this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }  
    window.open(this.article.url, '_blank');
  }

   
  async onOpenMenu() {

    const articleInFavorite = this.storageService.articleInFavorite(this.article);

    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'secondary'

      }
    ]

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };
 
    
    
    if( this.platform.is('capacitor') || this.platform.is('cordova') || navigator.share ){ 
      normalBtns.unshift(shareBtn);
    }
 
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',  
      buttons: normalBtns
       
    });
 
    

    await actionSheet.present();

    // const { role, data } = await actionSheet.onDidDismiss();
    // console.log('onDidDismiss resolved with role and data', role, data);
  }

  onShareArticle() { 

    //desestructuramos para evitar poner muchos this

    const { title, source, url} = this.article;

    this.compartirNoticia();

    //this.socialSharing.share(title,source.name,null,url);

      // this.socialSharing.share(
      // this.article.title,
      // this.article.source.name,
      // null,
      // this.article.url
    //) 
  }

  onToggleFavorite() {
    console.log('toggle favorite');
    this.storageService.saveRemoveArticles(this.article);
  } 

  compartirNoticia() {

    if(this.platform.is('cordova')) {

      const { title, source, url} = this.article;

      this.socialSharing.share(title,source.name,null,url);

    } else {
      if (navigator.share) {
        navigator.share({
          title: this.article.title,
          text: this.article.description,
          url: this.article.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        console.log('No se pudo compartir , acción no soportada.');
      }
    }

    
     
  }

}
