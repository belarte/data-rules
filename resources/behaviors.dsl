idle {
    wait
}

drink-potion {
    when
        hp below 50%;
        carries health-potion;
    then
        use health-potion
}

heal-self {
    when
        hp below 50%;
        equipped spells.heal;
        mp above spells.heal.cost;
    then
        cast heal self
}

heal-ally {
    when
        ally hp below 50%;
        equipped spells.heal;
        mp above spells.heal.cost;
    then
        cast heal ally
}