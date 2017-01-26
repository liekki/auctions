module.exports = function(id, val) {

  var ofThe = val.substring(val.indexOf(' ') + 1);
  if (ofThe == "Agility" 
      || ofThe == "Defense" 
      || ofThe == "Intellect" 
      || ofThe == "Spirit"
      || ofThe == "Stamina" 
      || ofThe == "Strength" 
      || ofThe == "Arcane Resistance"
      || ofThe == "Fire Resistance"
      || ofThe == "Frost Resistance"
      || ofThe == "Nature Resistance"
      || ofThe == "Shadow Resistance")
      return "of " + ofThe;
  else if (ofThe == "Arcane Spell Damage")
      return "of Arcane Wrath";
  else if (ofThe == "Fire Spell Damage")
      return "of Fiery Wrath";
  else if (ofThe == "Frost Spell Damage")
      return "of Frozen Wrath";
  else if (ofThe == "Holy Spell Damage")
      return "of Holy Wrath";
  else if (ofThe == "Nature Spell Damage")
      return "of Nature's Wrath";
  else if (ofThe == "Shadow Spell Damage")
      return "of Shadow Wrath";
      //|| ofThe == "Arcane Wrath"
      //|| ofThe == "Fiery Wrath"
      //|| ofThe == "Fire Resistance"
  //|| ofThe == "Fire Resistance"
  if ((id >= 2146 && id <= 2148) || id == 2153 || id == 2156
      || id == 2160 || id == 2162)
      return "of Restoration";
  else if ((id >= 2143 && id <= 2145) || id == 2152 || id == 2155
      || id == 2159 || id == 2161)
      return "of Sorcery";
  else if ((id >= 2149 && id <= 2151) || id == 2154 || id == 2157
      || id == 2158 || id == 2163)
      return "of Striking";
  else if (id == 51 || id == 78 || id == 116 || id == 156)
      return "of Critical Strike";
  else if (id == 32 || id == 33 || id == 34 || id == 80
      || id == 99 || id == 119 || id == 138)
      return "of Quality";
  else if (id == 50 || id == 65 || id == 77 || id == 92
      || id == 131 || id == 150)
      return "of Retaliation";
  else if (id == 29 || id == 30 || id == 31 || id == 79
      || id == 98 || id == 118 || id == 137 || (id >= 194 && id <= 198)
      || id == 207 || id == 210)
      return "of Toughness";
  else if (id == 117)
      return "of Twain";
  else if (id >= 1179 && id <= 1263)
      return "of the Bear";
  else if (id >= 1094 && id <= 1178)
      return "of the Boar";
  else if (id >= 839 && id <= 923)
      return "of the Eagle";
  else if ((id >= 227 && id <= 255) || (id >= 435 && id <= 500))
      return "of the Falcon";
  else if (id >= 924 && id <= 1008)
      return "of the Gorilla";
  else if (id >= 584 && id <= 668)
      return "of the Monkey";
  else if (id >= 754 && id <= 838)
      return "of the Owl";
  else if (id >= 669 && id <= 753)
      return "of the Tiger";
  else if (id >= 1009 && id <= 1093)
      return "of the Whale";
  else if (id == 228 || id == 256 || (id >= 501 && id <= 583))
      return "of the Wolf";
  else if (id >= 1647 && id <= 1703)
      return "of Blocking";
  else if (id >= 2067 && id <= 2104)
      return "of Concentration";
  else if (id >= 1742 && id <= 1798)
      return "of Eluding";
  else if (id >= 2027 && id <= 2064)
      return "of Healing";
  else if (id >= 1704 && id <= 1741)
      return "of Marksmanship";
  else if (id >= 1547 && id <= 1592)
      return "of Power";
  else if (id >= 39 && id <= 148)
      return "of Proficiency";
  else if (id >= 2105 && id <= 2142)
      return "of Regeneration";
  return "";
}