import { RESTDataSource } from 'apollo-datasource-rest'
import camelCaseKeys from 'camelcase-keys'
import { API_URL, PEOPLE_PER_PAGE } from "../utils/constants";

export class PeopleAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = API_URL
  }

  async people(page: number) {
    const data = await this.get('people',{ page});

    let transformedData ;

    if(data && data.results){
      transformedData = await Promise.all(data.results.map( async person => {
      const pathArray = person.homeworld.split('/');

      person.homeworld =  await this.getPersonHomeWorld(parseInt(pathArray[5]));
      return person;
    }));
    }
    data.results = transformedData;
    return camelCaseKeys(this.paginateResults(data), { deep: true });
  }
  async personByName(name: string) {
    const data = await this.get('people',{search: name});

    let person;

    if(data && data.count  === 1){
      person = data.results[0];
      const pathArray = person.homeworld.split('/');

      person.homeworld =  await this.getPersonHomeWorld(parseInt(pathArray[5]));
    }

    return camelCaseKeys(person, { deep: true });
  }

  async getPersonHomeWorld(id:number) {
    const homeworldData = await this.get(`planets/${id}`);

    return homeworldData;
  }

  paginateResults(data) {
    return {
      numberOfPages: Math.ceil(data.count/PEOPLE_PER_PAGE),
      hasNextPage: (typeof data.next ==='string')? true : false,
      hasPreviousPage: (typeof data.previous ==='string') ? true : false,
      people: data.results,
    }
  }
}

export const dataSources = () => ({ peopleAPI: new PeopleAPI() })
