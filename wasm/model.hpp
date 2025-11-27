#ifndef COCKTAIL_MODEL_HPP
#define COCKTAIL_MODEL_HPP
#include <string>
#include <vector>
struct Ingredient { std::string name; int ml; };
struct Cocktail {
  std::string name;
  std::vector<Ingredient> alcohols;
  std::string bitters;  // "none" | "angostura bitters" | "orange bitters" | "peychaud’s bitters"
  int dashes;
  std::string method;   // "shaken" | "stirred" | "build"
  std::string strain;   // "single" | "double" | "dump" | "na"
  std::string ice;      // "none" | "regular" | "crushed" | "large"
  std::vector<std::string> garnish;
  bool skipGarnishCheck{false};

  // -- optional flags --
  bool require_muddled = false;
  bool with_soda = false;
  bool with_ginger_beer = false;
  bool with_grapefruit_soda = false;

  std::string method_note;                 // short freeform note (1 paragraph)
};
#endif