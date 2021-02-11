const { AccessToken, BaseApiLink, Owner, Repo, FileName, History, BtcApi } = require('./Config.json');
const fetch = require('node-fetch').default;
const base64 = require('js-base64');

// https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
const updateHistory = async (btcData) => {
    const RepoData = await (await fetch(BaseApiLink + `/repos/${Owner}/${Repo}/contents/${History}`)).json();
    const RepoContentArray = JSON.parse(base64.decode(RepoData.content));
    RepoContentArray.push(btcData)

    const bodyObject = {
        message: `BTC Price Change - ${new Date}`,
        content: base64.encode(JSON.stringify(RepoContentArray)),
        sha: RepoData.sha
    };

    const res = await (await fetch(BaseApiLink + `/repos/${Owner}/${Repo}/contents/${History}`, {
        body: JSON.stringify(bodyObject),
        method: 'PUT',
        headers: {
            Authorization: `token ${AccessToken}`
        }
    })).json();

    console.log('Updated ' + History);

}
const updateReadMe = async (btcData) => {

    const RepoData = await (await fetch(BaseApiLink + `/repos/${Owner}/${Repo}/contents/${FileName}`)).json();

    const bodyObject = {
        message: `BTC Price Change - ${new Date}`,
        content: base64.encode(`BTC Price: $${btcData.bpi.USD.rate}\n\nDate: ${new Date}`),
        sha: RepoData.sha
    };
    const res = await (await fetch(BaseApiLink + `/repos/${Owner}/${Repo}/contents/${FileName}`, {
        body: JSON.stringify(bodyObject),
        method: 'PUT',
        headers: {
            Authorization: `token ${AccessToken}`
        }
    })).json();

    console.log('Updated ' + FileName);
};

let lastPrice;
const updateAll = async () => {
    const btcData = await (await fetch(BtcApi)).json();
    if(lastPrice == btcData.bpi.USD.rate) return;
    lastPrice = btcData.bpi.USD.rate;

    updateReadMe(btcData);
    setTimeout(() => {
        updateHistory(btcData);
    }, 5000);    
};


setInterval(() => {
    updateAll();
}, (30 * 60) * 1000);