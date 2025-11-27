// emcc wasm/app.cpp -O3 -s MODULARIZE=1 -s EXPORT_NAME=Module -s ENVIRONMENT=web -o wasm/app.js
#include <string>
#include <vector>
#include <sstream>
#include <emscripten.h>
#include "model.hpp"
#include "cocktails.hpp"

static std::vector<Cocktail> DB;

static std::string esc(const std::string& s){
  std::string out; out.reserve(s.size()+8);
  for(char c: s){ switch(c){
    case '\"': out += "\\\""; break; case '\\': out += "\\\\"; break;
    case '\n': out += "\\n"; break; case '\r': out += "\\r"; break;
    case '\t': out += "\\t"; break; default: out += c; } }
  return out;
}

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  const char* getCocktailNamesJSON(){
    seed_db(DB);
    static std::string out; std::ostringstream os; os << "[";
    for (size_t i=0;i<DB.size();++i){ if (i) os << ","; os << "\"" << esc(DB[i].name) << "\""; }
    os << "]"; out = os.str(); return out.c_str();
  }

  EMSCRIPTEN_KEEPALIVE
  const char* getAnswerKeyJSON(int index){
    seed_db(DB);
    static std::string out;

    if (index < 0) index = 0;
    if (index >= (int)DB.size()) index = (int)DB.size() - 1;

    const auto& c = DB[index];
    std::ostringstream os;

    os << "{";
    os << "\"index\":" << index << ",";
    os << "\"name\":\"" << esc(c.name) << "\",";

    // alcohols
    os << "\"alcohols\":[";
    for (size_t i = 0; i < c.alcohols.size(); ++i){
      if (i) os << ",";
      os << "{\"ml\":" << c.alcohols[i].ml
        << ",\"name\":\"" << esc(c.alcohols[i].name) << "\"}";
    }
    os << "],";

    // basics
    os << "\"bitters\":\"" << esc(c.bitters) << "\",";
    os << "\"dashes\":" << c.dashes << ",";
    os << "\"method\":\"" << esc(c.method) << "\",";
    os << "\"strain\":\"" << esc(c.strain) << "\",";
    os << "\"ice\":\"" << esc(c.ice) << "\",";

    // flags
    os << "\"require_muddled\":"      << (c.require_muddled      ? "true" : "false") << ",";
    os << "\"with_soda\":"            << (c.with_soda            ? "true" : "false") << ",";
    os << "\"with_ginger_beer\":"     << (c.with_ginger_beer     ? "true" : "false") << ",";
    os << "\"with_grapefruit_soda\":" << (c.with_grapefruit_soda ? "true" : "false") << ",";

    // garnish
    os << "\"skipGarnishCheck\":" << (c.skipGarnishCheck ? "true" : "false") << ",";
    os << "\"garnish\":[";
    for (size_t i = 0; i < c.garnish.size(); ++i){
      if (i) os << ",";
      os << "\"" << esc(c.garnish[i]) << "\"";
    }
    os << "],";

    // method note + steps
    os << "\"method_note\":\"" << esc(c.method_note) << "\",";
    os << "\"method_steps\":[";
    for (size_t i = 0; i < c.method_steps.size(); ++i){
      if (i) os << ",";
      os << "\"" << esc(c.method_steps[i]) << "\"";
    }
    os << "]";

    os << "}";

    out = os.str();
    return out.c_str();
  }
}
