import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ApiResponseResult } from '../../models/api-response';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'feed-card',
	templateUrl: './feed-card.component.html',
	styleUrls: ['./feed-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedCardComponent implements OnInit {
	private datetime: string = null;
	private inviewport: Observable<boolean>;
	@Input() private feedItem: ApiResponseResult;
	@Input() private feedIndex: number;
	@Output() private showLightBox: EventEmitter<any> = new EventEmitter();

	constructor(private ref: ChangeDetectorRef) { }

	ngOnInit() {
		let timer = Observable.timer (0 , 10000);
		timer.subscribe(t => this.ttt());
	}

	onShowed(show: boolean) {
		if (show) {
			this.showLightBox.emit({show : 'hide'});
		}
	}
	showHideLightbox(link: string) {
		window.open(link, '_blank');
		this.onShowed(true);
	}


	private get profileURL(): string {
		return `https://twitter.com/${this.feedItem.screen_name}/`;
	}


	private get profileName(): string {
		// The api's response.user.name has some errors for verified accounts and profile names with emojis.
		// It contains the an HTML part related to emojis in profile name.
		// So to handle such cases we take browser's help to remove such undesired strings.

		// HACK : To remove undesired string in profile name using browser.

		let html = this.feedItem.user.name;
		let div = document.createElement('div');
		div.innerHTML = html;
		let text = div.textContent || div.innerText || '';
		return text;
	}

	private get itemText(): string {
		// HACK : To remove undesired string in profile name using browser.

		let html = this.feedItem.text;
		let div = document.createElement('div');
		div.innerHTML = html;
		let text = div.textContent || div.innerText || '';
		return text;
	}

	private get retweetCount(): string {
		let retweets = this.feedItem.retweet_count;

		return (retweets === 0) ? '' : retweets.toString();
	}

	private get favoriteCount(): string {
		let favourites = this.feedItem.favourites_count;

		return (favourites === 0) ? '' : favourites.toString();
	}

	private  ttt(): any {
		this.datetime = this.tdiff();
		this.ref.markForCheck();
	}


	private tdiff(): string {
		let since: string = null ;
		let createdadt = this.feedItem.created_at;
		let today = new Date().toISOString();  // current time  in ISO format
		let todaytime = new Date(today).getTime();  // current time in ms
		let tweetday = new Date(createdadt).toISOString(); // tweeted time  in TSO format
		let tweettime = new Date(tweetday).getTime();  // tweeted at in ms
		let tt = todaytime - tweettime;  // (current time-tweeted at) in ms
		let sinceMin = Math.floor(Math.abs((todaytime - tweettime)) / 60000);
		let now = (new Date()).getFullYear();
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		let date2 = new Date(createdadt);

		if (sinceMin === 0) {
			let sinceSec = Math.round((todaytime - tweettime) / 1000);
			if (sinceSec <= 24) {
			since = 'now' ;
			}
			else {
				since = sinceSec + 's' ;
			}
		}
		else if (sinceMin >= 1 && sinceMin < 60) {
		since = sinceMin + 'm' ;
		}
		else if (sinceMin < 1440) {
		let sinceHr = Math.round(sinceMin / 60);
		since = sinceHr + 'h ago' ;
		}
		else if (date2.getFullYear() === now) {
			since = months[date2.getMonth()] + ' ' + date2.getDate()  ;
		}
		else {
			since = date2.getDate() + ' ' + months[date2.getMonth()] + ' ' + date2.getFullYear()  ;
		}

		return since;
	}

	private inview(event) {
		if(event.value == true)
		{
		this.inviewport=event.value;
		}

	}
}
