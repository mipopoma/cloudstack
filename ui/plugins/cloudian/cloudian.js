// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

(function (cloudStack) {
  cloudStack.plugins.cloudian = function(plugin) {

    var openInNewTab = function(url, data) {
        var form = document.createElement("form");
        form.action = url;
        form.method = 'POST';
        form.target = '_blank';
        if (data) {
            for (var key in data) {
                var input = document.createElement("textarea");
                input.name = key;
                input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                form.appendChild(input);
            }
        }
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
    };

    plugin.ui.addSection({
      id: 'cloudian',
      title: 'Cloudian Storage',
      showOnNavigation: true,
      preFilter: function(args) {
        var pluginEnabled = false;
        $.ajax({
            url: createURL('cloudianIsEnabled'),
            async: false,
            success: function(json) {
                pluginEnabled = (json.cloudianisenabledresponse.success == 'true');
            }
        });
        return pluginEnabled;
      },
      show: function() {
        var description = 'Cloudian Storage should open in another window.';
        $.ajax({
            url: createURL('cloudianSsoLogin'),
            async: false,
            success: function(json) {
                var response = json.cloudianssologinresponse.cloudianssologin;
                var url = response.url.split("?")[0];
                var data = JSON.parse('{"' + decodeURI(response.url.split("?")[1].replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
                openInNewTab(url, data);
            },
            error: function(data) {
                description = 'Single-Sign-On failed for Cloudian Storage.';
            }
        });
        return $('<div>').html(description);
      }
    });
  };
}(cloudStack));
