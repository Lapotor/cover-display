/*
 * Copyright (c) Valentin Sickert
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this
 *  software and associated documentation files (the "Software"), to deal in the Software
 *  without restriction, including without limitation the rights to use, copy, modify, merge,
 *  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 *  to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or
 *  substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 *  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 *  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 *  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *  DEALINGS IN THE SOFTWARE.
 */
function $_GET(param) {
    let vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

function getItunesUrl(song, artist, german) {
    let url = "https://itunes.apple.com/search?term=" + encodeURIComponent(artist) + "+" + encodeURIComponent(song) + "&entity=album&entity=musicArtist&entity=musicTrack&limit=1";
    if (german) {
        url = url + "&country=de"
    }
    return url;
}

function getImageUrl(url, width, height) {
    let imageUrl = url.substring(0, url.lastIndexOf('/')) + '/' + width + "x" + height + ".jpg";
    return imageUrl.replace(/^(http):\/\//gi, "https://")
}

function getLiveStatus(json_song) {
    if (json_song['live']) {
        if (live != json_song['live'].toString()) {
            if (json_song['live'] == true) {
                $('#live p i').removeClass('notLive').addClass('blink-2');
                $('#live p span').html('On Air');
            } else {
                $('#live p i').removeClass('blink-2').addClass('notLive');
                $('#live p span').html('Off Air');

            }
        }
    } else {
        if (live != false) {
            $('#live p i').removeClass('blink-2').addClass('notLive');
            $('#live p span').html('Off Air');
        }
    }
}

function coverLoop(song_url, station_img) {
    setTimeout(function () {

        getCover(song_url, station_img);
        coverLoop(song_url, station_img);
    }, 2000)
}

function getCover(song_url, station_img) {
    $.getJSON(song_url, function (current) {
        getLiveStatus(current);
        if (song_str != (current.title + " " + current.artist.name))  {
            song_str = current.title + " " + current.artist.name
            $.getJSON(getItunesUrl(current.title, current.artist.name), function (song) {
                let img_url;
                if (song.resultCount === 0) {
                    $.getJSON(getItunesUrl(current.title, current.artist.name, true), function (song_ger) {
                        song = song_ger;
                    });
                    if (song.resultCount === 0) {
                        img_url = station_img;
                    } else {
                        img_url = getImageUrl(song.results[0].artworkUrl100, width, height);
                    }
                } else {
                    img_url = getImageUrl(song.results[0].artworkUrl100, width, height);
                }
                $("#image").attr("src", img_url).attr("alt", current.title + ", " + current.artist.name).attr("width", width).attr("height", height)
            })
        }
    })
}