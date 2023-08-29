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