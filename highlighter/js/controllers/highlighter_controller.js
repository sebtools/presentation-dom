//Mostlye written by GitHub CoPilot
import { Controller } from "../app.js";

export default class extends Controller {
	static values = { words: String }

	connect() {
		console.log("connected");
		//this.highlightWords();
	}

	highlightWords() {
		const words = this.wordsValue.split(' ');
		let content = this.element.innerHTML;

		console.table(words);

		words.forEach(word => {
			const regex = new RegExp(`\\b${word}\\b`, 'gi');
			content = content.replace(regex, `<span class="highlight">${word}</span>`);
		});

		this.element.innerHTML = content;
	}
}