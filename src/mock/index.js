import axios from 'axios';
import Mock from 'mockjs';
import MockAdapter from 'axios-mock-adapter';
import article_tableAPI from './article_table'
const mock = new MockAdapter(axios);

const articleList = {
  'data|20': [{
    id: '@id',
    title: '@ctitle(10, 20)',
    'status|1': ['published', 'draft'],
    author: '@cname',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
}
const data = JSON.stringify(Mock.mock(articleList))
mock.onGet('/article/list').reply(200, data);


mock.onGet('/article_table/list').reply(article_tableAPI.getList);



export default mock;
