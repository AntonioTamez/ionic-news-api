import { Article } from './../../interfaces/index';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent   {

  @Input() articles: Article[] = [];

  constructor() { }
 

}
