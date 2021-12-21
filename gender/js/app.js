'use strict'
import { fullCountry } from "./country.js";

let load = document.createElement('div');
load.classList.add('loader');

let genderizeNationalize = {
    fullCountry: fullCountry,
    firstName: '',
    gender: '',
    nationality: '',
    getGender() {
        const serverUrl = 'https://api.genderize.io';
        const url = `${serverUrl}?name=${this.firstName}`;
        const promise = fetch(url).then(response => response.json());
        return promise.then(gender => {
            return gender.gender !== null ? gender.gender : 'I do not understand you gender';
        });
    },
    getNationality() {
        const serverUrl = 'https://api.nationalize.io';
        const url = `${serverUrl}?name=${this.firstName}`;
        const promise = fetch(url).then(response => response.json());
        return promise.then(
            nationality => {
                try {
                    return this.fullCountry[nationality.country[0].country_id];
                } catch {
                    return 'I do not understand you nationality';
                }
            }
        );
    },
    updateView() {
        const nameParagraph = document.querySelector('.genderize-nationalize__result p:first-child');
        const gender = document.querySelector('.genderize-nationalize__result p:nth-child(2)');
        const nationality = document.querySelector('.genderize-nationalize__result p:last-child');
        nameParagraph.textContent = `Name: ${this.firstName}`;
        gender.textContent = `Gender: ${this.gender}`;
        nationality.textContent = `Nationality: ${this.nationality}`;
    },
    submitHandler(event) {
        const input = event.target.firstElementChild.value.trim();

        if(input !== '') {
            this.firstName = input;
            this.gender = '...';
            this.nationality = '...';
            this.updateView();
            this.getGender().then(gender => {
                this.gender = gender;
                this.updateView();
            });
            this.getNationality().then(nationality => {
                this.nationality = nationality;
                this.updateView();
            })
        }
        event.preventDefault();
    }
}
document.querySelector('.genderize-nationalize__form').addEventListener('submit', (event) => genderizeNationalize.submitHandler(event));