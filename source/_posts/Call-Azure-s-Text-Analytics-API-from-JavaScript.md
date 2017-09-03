---
title: Call Azure's Text Analytics API from JavaScript
date: 2017-09-03 14:07:21
tags:
  - JavaScript
  - Azure
---

Previously, I created docker environment with Nginx, Rails and Postgres.
{% post_link nginx-rails-postgres-with-docker-compose %}

In it, I ran a rails application with [Azure's Text Analytics API](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/). 
With it, I made app which detect key phrases from text.

<img src="{% asset_path text-smasher-demo.gif %}" style="border: 1px solid LightSlateGray" />

## Register Azure and get trial access token of the API

You can do it from here (free trial token valids only 30 days).
[Microsoft Azure - Text Analytics API](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/)

## Setup in rails

Create controller in rails container.
I created docker environment in {% post_link nginx-rails-postgres-with-docker-compose this post %}.
```console
$ docker-compose run app bundle exec rails g controller smash
```

Configure routing.
`$ vim config/routes.rb`
```diff
Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
+  resources :smash, only: :index
+  root 'smash#index'
end
```

## Write view and call the API

This is over view.
1. Set text to a textare.
2. Press submit button.
3. We send the text to Text Analytics API and receive extracted words.

Here is my code.
In the code calling API, you have to pass your API key which you get in your Azure member page.
`$ vim app/views/smash/index.erb`
```html
<!-- Cute Alpaca icon and title. -->
<div style="margin-bottom: 16px">
  <img style="width: 38px; height: 38px" src="https://i.pinimg.com/originals/a6/bd/07/a6bd07140b8e12855ce842f189d8fa36.jpg" alt="Smiley face" />
  <span style="font-size: 32px">Smash text into words</span>
</div>

<!-- Input text area and submit button. -->
<div style="display: inline-block">
  <textarea name="name" id="js-inputText" rows="8" cols="80"></textarea>
  <button type="submit" name="submit" id="js-submit">Send</button>
</div>

<!-- Set results from calling API. -->
<p>Result</p>
<ul id="resultList" style="list-style: none"></ul>

<script type="text/javascript">
'use strict';
document.addEventListener("DOMContentLoaded", () => {
  // When sugmit button clicked, call Azure Text Analytics API.
  document.getElementById('js-submit').addEventListener('click', listener => {
    const inputText = document.getElementById('js-inputText').value;
    const requestBody = {
      "documents": [
        {
          "language": "en",
          "id": "1",
          "text": inputText,
        }
      ]
    };
    // API request
    (requestBody => {
      const request = new XMLHttpRequest();
      request.open('POST', 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases', true);
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader("Ocp-Apim-Subscription-Key", "xxxxxxxxxxxxxxxxxxxxx"); // Set API key.
      request.setRequestHeader("Accept","application/json");
      request.onload = () => {
        const resultList = document.getElementById('resultList');
        // Clear resultList field.
        resultList.innerHTML = '';
        // Set response data.
        JSON.parse(request.responseText).documents.forEach(result => {
          result.keyPhrases.forEach(phrase => {
            const li = document.createElement('li');
            li.innerHTML = `<label><input type="checkbox" />${phrase}</label>`;
            resultList.appendChild(li);
          });
        });
      };
      request.onerror = () => {
        alert(request.responseText);
      };
      request.send(JSON.stringify(requestBody));
    })(requestBody);
  });
});
</script>
```

Here is my whole code of this including docker files;)
https://github.com/alpaca0984/text-smasher