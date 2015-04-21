#! /usr/bin/env python

from flask import Flask, request, render_template, redirect, url_for
import pusher
import random
import string

app = Flask(__name__)
app.config.from_object('socsound-cfg')

p = pusher.Pusher(
    app_id=app.config['PUSHER_APP_ID'],
    key=app.config['PUSHER_KEY'],
    secret=app.config['PUSHER_SECRET']
)


serverstate = {}


@app.route('/')
def index():
    randid = ''.join(
        random.choice(
            string.ascii_uppercase + string.digits
        ) for _ in range(10)
    )
    return redirect(url_for('open_seq', seq_id=randid))


@app.route('/sequencer/<string:seq_id>')
def open_seq(seq_id):
    if seq_id not in serverstate:
        serverstate[seq_id] = {
            'buttons': {},
            'bpm': 120
        }
    button_info = serverstate[seq_id]['buttons'].items()
    bpm = serverstate[seq_id]['bpm']
    return render_template(
        'index.html',
        button_info=button_info,
        bpm=bpm,
        seq_id=seq_id,
        pusher_key=app.config['PUSHER_KEY']
    )


@app.route('/sequencer/<string:seq_id>/button/press', methods=['POST'])
def newWord(seq_id):
    if seq_id not in serverstate:
        return "Sequencer doesn't exist", 404
    else:
        button_data = request.get_json()
        button_row = int(button_data['row'])
        button_col = int(button_data['column'])
        button_state = int(button_data['state'])

        seq_state = serverstate[seq_id]

        seq_buttons = seq_state['buttons']
        bkey = "%i,%i" % (button_row, button_col)

        if button_state == 0:
            del(seq_buttons[bkey])
        else:
            seq_buttons[bkey] = button_state

        p[seq_id].trigger('button', button_data)
        return ("Pressed Button", 200)


@app.route('/sequencer/<string:seq_id>/bpm', methods=['POST'])
def updateWord(seq_id):
    if seq_id not in serverstate:
        return "Sequencer doesn't exist", 404
    else:
        bpm_data = request.get_json()
        new_bpm = int(bpm_data['bpm'])

        serverstate[seq_id]['bpm'] = new_bpm

        p[seq_id].trigger('bpm', bpm_data)
        return ("Changed BPM to %s" % str(new_bpm), 200)


if __name__ == '__main__':
    app.debug = True
    app.run()
