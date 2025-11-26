#ifndef COCKTAIL_LIST_HPP
#define COCKTAIL_LIST_HPP
#include <vector>
#include <utility>
#include <unordered_set> 
#include <string>
#include "model.hpp"

static inline void apply_extras(std::vector<Cocktail>& DB){
  using Str = std::string;

  const std::unordered_set<Str> REQUIRE_MUDDLED = { "MOJITO", "CAIPIRINHA", "CAPRIOSKA" };
  const std::unordered_set<Str> WITH_SODA       = { "TOM COLLINS", "GIN FIZZ", "APEROL SPRITZ", "LIMONCELLO SPRITZ", "ELDERFLOWER SPRITZ" };
  const std::unordered_set<Str> WITH_GINGER     = { "MOSCOW MULE", "DARK AND STORMY" };
  const std::unordered_set<Str> WITH_GRAPEFRUIT = { "PALOMA" };

  for (auto& c : DB){
    c.require_muddled       = REQUIRE_MUDDLED.count(c.name) > 0;
    c.with_soda             = WITH_SODA.count(c.name) > 0;
    c.with_ginger_beer      = WITH_GINGER.count(c.name) > 0;
    c.with_grapefruit_soda  = WITH_GRAPEFRUIT.count(c.name) > 0;
  }
}

inline void seed_db(std::vector<Cocktail>& DB){
  if (!DB.empty()) return;
  auto push = [&](Cocktail c){ DB.push_back(std::move(c)); };

   // --- TOP 60 COCKTAILS (data only) ---
  push({"ESPRESSO MARTINI", {{"Wyborowa Vodka",30},{"Tia Maria",30},{"Little Dripper",30},{"Sugar syrup",15}},
      "none",0,"shaken","double","none",{"grated chocolate","three coffee beans","3 coffee beans"},false});

push({"NEGRONI", {{"Beefeater Gin",30},{"Campari",30},{"Rosso Antico Sweet Vermouth",30}},
      "none",0,"stirred","single","large",{"orange peel","orange twist"},false});

push({"MARGARITA", {{"Olmeca Plata",45},{"Cointreau",15},{"Lime juice",30}},
      "none",0,"shaken","single","regular",{"lime wheel","no garnish","none"},false});

push({"AMARETTO SOUR", {{"Disaronno Amaretto",60},{"Lemon juice",30},{"Sugar syrup",10}},
      "none",0,"shaken","double","regular",{"2 cherries on a skewer","two cherries on a skewer","2 cherries"},false});

push({"PORN STAR MARTINI", {{"Absolut Vanilla Vodka",30},{"Passoa Passion Liqueur",30},{"Passionfruit puree",30},{"Lime juice",15},{"Prosecco",45}},
      "none",0,"shaken","double","none",{"1/2 passionfruit","half passionfruit","passionfruit half"},false});

push({"OLD FASHIONED", {{"Buffalo trace",60},{"Sugar syrup",15}},
      "angostura bitters",3,"stirred","single","large",{"orange twist","orange peel"},false});

push({"MARTINI", {{"Vodka or Gin",60}},
      "none",0,"stirred","single","none",{"2 x olive on skewer","olive","lemon twist"},false});

push({"SPICY MARGARITA", {{"Altos Reposado",60},{"Lime juice",30},{"Chilli agave syrup",20}},
      "none",0,"shaken","single","regular",{"jalapeno wheel and lime wheel","jalapeno and lime wheel"},false});

push({"APEROL SPRITZ", {{"Aperol",30},{"Prosecco",60}},
      "none",0,"build","na","regular",{"orange wedge"},false});

push({"WHISKY SOUR", {{"Ballantines Scotch",60},{"Lemon juice",30},{"Sugar syrup",30}},
      "none",0,"shaken","double","none",{"bitters hearts"},false});

push({"TOMMY’S MARGARITA", {{"Olmeca Reposado",60},{"Lime juice",30},{"Crawleys Agave syrup",15}},
      "none",0,"shaken","double","large",{"lime wheel"},false});

push({"LYCHEE MARTINI", {{"Beefeater Gin",20},{"Soho Lychee",20},{"Rockbare Riesling",20},{"Lychee juice",30},{"Sugar syrup",15},{"Lychee",1}},
      "none",0,"shaken","double","none",{"lychee on skewer","lychee"},false});

push({"LONG ISLAND ICED TEA", {{"Wyborowa Vodka",15},{"Beefeater Gin",15},{"Havana Club 3 Y/O Anos",15},{"Olmeca Plata",15},{"Cointreau",15},{"Lemon juice",30}},
      "none",0,"shaken","single","regular",{"lemon wedge - METHOD: Fill glass with ice and half coke, shake all ingredients and strain over coke "},false});

push({"COSMOPOLITAN", {{"Absolut Citron Vodka",45},{"Cointreau",15},{"Cranberry juice",30},{"Lime juice",15}},
      "none",0,"shaken","double","none",{"flamed orange coin","orange coin"},false});

push({"SOUTHSIDE", {{"Beefeater Gin",60},{"Lime juice",20},{"Sugar syrup",20}},
      "none",0,"shaken","double","none",{"mint leaf"},false});

push({"MOJITO", {{"Havana Club 3 Y/O Anos",60}},
      "none",0,"build","na","crushed",{"mint sprig"},false});

push({"PINA COLADA", {{"Havana Especial",60},{"Pineapple juice",60},{"Lime juice",30},{"Coco Real Cream of Coconut",30}},
      "none",0,"shaken","dump","crushed",{"2 pineapple fronds","two pineapple fronds"},false});

push({"MOSCOW MULE", {{"Wyborowa Vodka",60}},
      "none",0,"build","na","crushed",{"mint sprig - METHOD: Muddle 4 Lime wedges and vodka"},false});

push({"FRENCH MARTINI", {{"Wyborowa Vodka",30},{"Chambord",30},{"Pineapple juice",30}},
      "none",0,"shaken","double","none",{"none"},false});

push({"CHARLIE CHAPLAN", {{"Joseph Cartron Apricot Brandy",30},{"Plymouth Sloe Gin",30},{"Lime juice",30}},
      "none",0,"shaken","double","none",{"lime bow"},false});

push({"CLOVER CLUB", {{"Beefeater Gin",45},{"Maidenii Dry Vermouth",15},{"Lemon juice",30},{"Raspberry syrup",15}},
      "none",0,"shaken","double","none",{"three raspberries on a skewer","3 raspberries on a skewer"},false});

push({"JAPANESE SLIPPER", {{"Midori",30},{"Cointreau",30},{"Lemon juice",30}},
      "none",0,"shaken","double","none",{"maraschino cherry"},false});

push({"MANHATTAN", {{"Woodford Reserve",45},{"Rosso Antico Sweet vermouth",15}},
      "angostura bitters",2,"stirred","single","none",{"maraschino cherry"},false});

push({"PAINKILLER", {{"Havana Especial Rum",60},{"Pineapple juice",120},{"Coconut cream",30},{"Orange juice",30}},
      "none",0,"shaken","dump","crushed",{"grated nutmeg","nutmeg"},false});

push({"PALOMA", {{"Olmeca Plata",45}},
      "none",0,"build","na","regular",{"tajin rim"},false});

push({"CORPSE REVIVER #2", {{"Beefeater Gin",20},{"Lillet Blanc",20},{"Cointreau",20},{"Lemon juice",20}},
      "none",0,"shaken","double","none",{"lemon twist"},false});

push({"SLOE GIN SOUR", {{"Plymouth Sloe Gin",60},{"Lemon juice",15},{"Lime juice",15},{"Sugar syrup",20}},
      "none",0,"shaken","double","none",{"none"},false});

push({"NAKED & FAMOUS", {{"Vida Mezcal",20},{"Yellow Chartreuse",20},{"Aperol",20},{"Lime juice",20}},
      "none",0,"shaken","double","none",{"thyme sprig"},false});

push({"MAI TAI", {{"Havana Especial Rum",45},{"Cointreau",15},{"Lime juice",20},{"Orgeat",10}},
      "none",0,"shaken","dump","crushed",{"lime wheel","mint sprig"},false});

push({"MISSIONARY’S DOWNFALL", {{"Havana Club 3 Y/O Anos",30},{"Peach Schnapps",15},{"Lime juice",45},{"Sugar syrup",15}},
      "none",0,"shaken","dump","crushed",{"mint sprig"},false});

push({"DARK AND STORMY", {{"Goslings Black Seal Rum",45},{"Lime juice",15}},
      "none",0,"build","na","regular",{"mint sprig"},false});

push({"SINGAPORE SLING", {{"Beefeater Gin",45},{"Cherry Heering",15},{"Cointreau",7},{"Dom Benedictine",7},{"Pineapple juice",45},{"Lime juice",15},{"Grenadine",10}},
      "angostura bitters",1,"shaken","single","regular",{"cherry and orange slice","orange slice and cherry"},false});

push({"PENICILLIN", {{"Naked Grouse Whisky",45},{"Lemon juice",20},{"Honey & ginger syrup",20},{"Ardbeg 10 Y/O",5}},
      "none",0,"shaken","double","large",{"candied ginger on skewer","candied ginger"},false});

push({"NUCLEAR SOUR", {{"Jim Beam Rye",25},{"Yellow Chartreuse",25},{"Falernum",10},{"Lemon juice",20},{"Red Wine",15}},
      "none",0,"shaken","double","large",{"red wine float"},false});

push({"GRASSHOPPER", {{"Crème de Menthe",30},{"Josph Cartron White Crème de Cacao",30},{"Cream",30}},
      "none",0,"shaken","double","none",{"mint leaf","grated chocolate"},false});

push({"FRENCH 75", {{"Beefeater Gin",20},{"Lemon juice",10},{"Sugar syrup",10},{"Chandon Brut",75}},
      "none",0,"shaken","double","none",{"lemon bow"},false});

push({"PI YI", {{"Havana Club 3 Y/O Anos",30},{"Havana Especial Rum",20},{"Pineapple juice",30},{"Lime juice",15},{"Passionfruit syrup",15},{"Runny Honey",5}},
      "angostura bitters",1,"shaken","dump","crushed",{"2 pineapple leaves","two pineapple leaves"},false});

push({"LIMONCELLO SPRITZ", {{"Villa Massa Limoncello",30},{"Prosecco",60}},
      "none",0,"build","na","regular",{"lemon slice"},false});

push({"BLACK & WHITE RUSSIAN", {{"Kahlua",30},{"Wyborowa Vodka",30}},
      "none",0,"build","na","regular",{"Milk for White, Cola for Black"},false});

push({"DAIQUIRI", {{"Havana Club 3 Y/O Anos",60},{"Lime juice",30},{"Sugar syrup",15}},
      "none",0,"shaken","double","none",{"lime twist"},false});

push({"DAIQUIRI (HEMINGWAY)", {{"Havana Club 3 Y/O Anos",45},{"Luxardo Maraschino",10},{"Lime juice",15},{"Grapefruit juice",30}},
      "none",0,"shaken","double","none",{"lime twist"},false});

push({"LAST WORD", {{"Beefeater Gin",20},{"Green Chartreuse",20},{"Luxardo Maraschino",20},{"Lime juice",20}},
      "none",0,"shaken","double","none",{"maraschino cherry"},false});

push({"BRAMBLE", {{"Beefeater Gin",50},{"Lemon juice",30},{"Sugar syrup",15},{"Chambord",10}},
      "none",0,"shaken","single","crushed",{"chambord drizzle","measure and pour 10ml chambord"},false});

push({"BLOODY MARY", {{"Wyborowa Vodka",60},{"Tomato juice",120},{"Lemon juice",15},{"Olive brine",20}},
      "none",0,"build","na","regular",{"Add Celery Salt, Pepperm Tobasco, Worcestershire sauce, and various garnishes"},true});

push({"GIMLET", {{"Beefeater Gin",60},{"Lime juice", 20},{"Sugar syrup",20}},
      "none",0,"shaken","double","none",{"lime twist - Optional Lime Marmelade instead of Lime juice and sugar syrup"},false});

push({"GIN FIZZ", {{"Beefeater Gin",60},{"Lemon juice",20},{"Sugar syrup",15}},
      "none",0,"shaken","double","none",{"Method: pour into glass ½ filled with soda, top with more soda if needed. "},false});

push({"NEW YORK SOUR", {{"Jim Beam Rye",60},{"Lemon juice",30},{"Sugar syrup",15},{"House Red wine",30}},
      "none",0,"shaken","double","large",{"float red wine","red wine float"},false});

push({"PISCO SOUR", {{"Pancho Pisco",60},{"Lime juice",30},{"Sugar syrup",30}},
      "none",0,"shaken","double","none",{"bitters hearts"},false});

push({"AVIATION", {{"Beefeater Gin",50},{"Luxardo Maraschino",10},{"Tempus Fugit Liqueur de Violettes",10},{"Lemon juice",20}},
      "none",0,"shaken","double","none",{"maraschino cherry"},false});

push({"ZOMBIE", {{"Havana Club 3 Y/O Anos",15},{"Havana Club Especial Rum",15},{"Goslings Black Seal Rum",15},{"Joseph Cartron Apricot Brandy",15},{"green chartreuse",15},{"Grapefruit juice",45},{"Lime juice",15},{"Grenadine",5},{"Passionfruit syrup",5},{"Falernum", 7}, {"Honey Syrup", 7}},
      "none",0,"shaken","dump","crushed",{"flaming citrus shell","half passionfruit or lime shell with flame"},false});

push({"BOULEVARDIER", {{"Jim Beam Rye",40},{"Campari",20},{"Rosso Antico Sweet vermouth",20}},
      "none",0,"stirred","single","large",{"orange twist - COCKTAIL IS THROWN NOT STIRRED"},false});

push({"CAIPIRINHA", {{"Sagatiba Cachaca",60}},
      "none",0,"build","na","crushed",{"lime wedge - METHOD: Muddle 4 Lime Wedges and 1 heaped barspoon of brown sugar with Cachaca"},false});

push({"TOM COLLINS", {{"Beefeater Gin",60},{"Lemon juice",30},{"Sugar syrup",15}},
      "none",0,"shaken","single","regular",{"lemon wedge"},false});

push({"LOST WORD", {{"Martell VS Cognac",20},{"Yellow Chartreuse",20},{"Luxardo Maraschino",20},{"Lemon juice",20}},
      "none",0,"shaken","double","none",{"maraschino cherry"},false});

push({"RUSTY NAIL", {{"Glenmorangie Original 10 Y/O",40},{"Drambuie",20}},
      "none",0,"build","na","large",{"lemon twist"},false});

push({"JAPANESE STRIPPER", {{"Midori",30},{"Licor 43",30},{"Lemon juice",30}},
      "none",0,"shaken","double","none",{"maraschino cherry"},false});

push({"CAPRIOSKA", {{"Wyborowa Vodka",60}},
      "none",0,"build","na","crushed",{"lime wedge - METHOD: Muddle 4 Lime Wedges and 1 heaped barspoon of brown sugar with Vodka"},false});

push({"BIJOU", {{"Beefeater Gin",30},{"Rosso Antico Sweet vermouth",15},{"Green Chartreuse",15}},
      "orange bitters",2,"shaken","single","none",{"orange twist"},false});

push({"SAZERAC (Original)", {{"Jim Beam Rye",60},{"Sugar syrup",15}},
      "peychaud’s bitters",3,"stirred","single","none",{"lemon twist + absinthe spray"},false});

push({"SAZERAC (New Orleans)", {{"Martel VS Cognac",60},{"Sugar syrup",10}},
      "peychaud’s bitters",3,"stirred","single","none",{"lemon twist + absinthe spray"},false});

push({"SAZERAC (New York)", {{"Jim Beam Rye",30},{"Martel VS Cognac",30},{"Sugar syrup",10}},
      "peychaud’s bitters",3,"stirred","single","none",{"lemon twist + absinthe spray"},false});

push({"ELDERFLOWER SPRITZ", {{"Fiorente Elderflower",30},{"Prosecco",60}},
      "none",0,"build","na","regular",{"lemon slice"},false});

push({"SIDECAR", {{"Martel VS Cognac",45},{"Cointreau",15},{"Lemon juice",20}},
      "none",0,"shaken","double","none",{"lemon twist"},false});

apply_extras(DB);
}
#endif