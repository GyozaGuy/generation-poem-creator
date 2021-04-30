require 'chinese_pinyin'

# TranslationController class
class TranslationController < ApplicationController
  def lookup
    mode, term = params.values_at 'mode', 'term'
    response = trans term, mode || 'trad'
    render json: response
  end

  def pinyin
    render json: { pinyin: Pinyin.t(params['poem'], tonemarks: true) }
  end
end

private

def create_pairs(list)
  new_list = []

  (list.length / 2).times do |i|
    new_list << [list[i * 2], list[i * 2 + 1]]
  end

  new_list
end

def parse_result(result)
  term, _, nouns, verbs, alternates = result.split /\n\n/
  word, pronunciation = term.split /\n/
  {
    alternates: alternates ? alternates.split(/\n/).drop(1).join('').split(/,\s/) : [],
    nouns: nouns ? create_pairs(nouns.split(/\n/).drop(1)) : [],
    term: { pronunciation: pronunciation, word: word },
    verbs: verbs ? create_pairs(verbs.split(/\n/).drop(1)) : []
  }
end

def trans(term, mode)
  style = mode == 'trad' ? 'zh-TW' : 'zh'
  parse_result `trans -indent 0 -no-ansi -show-languages false -show-original false -show-original-phonetics false -s en -t #{style} #{term}`
end
