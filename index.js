const { AccessToken, BaseApiLink, Owner, Repo, FileName } = require('./Config.json');
const fetch = require('node-fetch').default;
const base64 = require('js-base64');

// https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
const updateBtc = async () => {

    const RepoData = await (await fetch(BaseApiLink + `/repos/${Owner}/${Repo}/contents/${FileName}`)).json();

    console.log(RepoData);

    const bodyObject = {
        message: `TEST - ${new Date}`,
        content: base64.encode('Hello this is a test'),
        sha: RepoData.sha
    };

    const res = await (await fetch(BaseApiLink + `/repos/${Owner}/${Repo}/contents/${FileName}`, {
        body: JSON.stringify(bodyObject),
        method: 'PUT',
        headers: {
            Authorization: `token ${AccessToken}`
        }
    })).json()

    console.log(res)

}

updateBtc()