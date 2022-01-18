import { Article } from './../interfaces/index';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

    constructor( private storage: Storage) {
    this.init();
  }

  get getLocalArticles() {
    return [...this._localArticles];
  }
  
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }
  
  async saveRemoveArticles(articles: Article) {

    const exists = this._localArticles.find(localArticle => localArticle.title === articles.title);

    if( exists ) {
      this._localArticles = this._localArticles.filter(localArticle => localArticle.title !== articles.title);
    } else {
      this._localArticles = [articles,...this._localArticles];
      //this._localArticles.push(articles);
    }
 
    this._storage.set('articles', this._localArticles);
  }

  async loadFavorites() {
    try{

      const articles = await this._storage.get('articles');
      this._localArticles = articles || [];

    }catch (error){
      console.log(error);
    }
  }


  articleInFavorite(article: Article) {
    return !!this._localArticles.find(localArticle => localArticle.title === article.title);
  }



}
