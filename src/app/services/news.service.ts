import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NewsResponse, Article, ArticlesByCategoryAndPage } from '../interfaces/index';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { storedArticlesByCategory } from '../data/mock-news';
 

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = storedArticlesByCategory;

  constructor(private http: HttpClient) { }

  private executeQuery<T>( endpoint: string ) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: {
        apiKey:apiKey,
        country: 'us',
      }
    });
   }

     getTopHeadlines():Observable<Article[]>{
       return this,this.getTopHeadlinesByCategory('business');
      // return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
      // .pipe(
      //   map(({articles}) => articles)
      // );
    }

    getTopHeadlinesByCategory(category:string, loadMore:boolean = false):Observable<Article[]>{
     
      return of(this.articlesByCategoryAndPage[category].articles);
      
      if(loadMore){
        return this.getArticlesByCategory( category );
      }


      if( this.articlesByCategoryAndPage[category] ){
        return of(this.articlesByCategoryAndPage[category].articles);
      }

      return this.getArticlesByCategory( category );
      // return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}`)
      //   .pipe(
      //     map(({articles}) => articles)
      //  );
    }

    private  getArticlesByCategory(category:string): Observable<Article[]>{
      
      
      if( Object.keys( this.articlesByCategoryAndPage ).includes(category) ){
         //ya  existe la categoria
         //this.articlesByCategoryAndPage[category].page += 1;
       } else {
          //no existe la categoria
          this.articlesByCategoryAndPage[category] = {
            page:0,
            articles:[]
          }
       }

       const page = this.articlesByCategoryAndPage[category].page + 1;
       
       return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
       .pipe(
        //map( resp => resp.articles) 
          map( ({ articles }) => {
            
            if( articles.length === 0 ) return this.articlesByCategoryAndPage[category].articles;



            this.articlesByCategoryAndPage[category] = {
              page : page,
              articles : [...this.articlesByCategoryAndPage[category].articles, ...articles]
            }

            //return articles;
            return this.articlesByCategoryAndPage[category].articles;
          })
      );
    }

  }
