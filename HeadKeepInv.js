//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\zhang\Dropbox\Aids/dts/HelperLib-master/src/index.d.ts"/> 

ll.registerPlugin("HeadKeepInv", "Keep Inventory with Head!", [1, 2, 0]);

function CheckHead(pl) {
    let itemlist = pl.getInventory().getAllItems();
    let count = 0;
    for (let i of itemlist) {
        if (i.type == "minecraft:skull" && i.aux == 3) {
            count += i.count;
        }
    }
    let helmet = pl.getArmor().getItem(0);
    if (helmet.type == "minecraft:skull" && helmet.aux == 3) {
        count += 1;
    }
    return count;
}
function RemoveHead(pl) {
    let helmet = pl.getArmor().getItem(0);
    if (helmet.type == "minecraft:skull" && helmet.aux == 3) {
        pl.getArmor().removeItem(0, 1);
        pl.refreshItems();
        return;
    }

    let itemlist = pl.getInventory().getAllItems();
    let count = 0;
    for (i of itemlist) {
        if (i.type == "minecraft:skull" && i.aux == 3) {
            pl.getInventory().removeItem(count, 1);
            break;
        }
        count++;
    }
    pl.refreshItems();
}

function hasCurseofVanishing(it) {
    if (it == null) return false;
    let tag = it.getNbt().getData("tag");
    if (tag != null) {
        let ench = tag.getData("ench");
        if (ench != null) {
            ench = ench.toArray();
            for (let e of ench) {
                if (e.id == 28) {
                    return true;
                }
            }
        }
    }
    return false;
}

function DropInventory(pl) {
    let itemlist = pl.getInventory().getAllItems();
    for (let it of itemlist) {
        if (!it.isNull()) {
            if (!hasCurseofVanishing(it)) {
                mc.spawnItem(it, pl.pos);
            }
        }
    }
    pl.getInventory().removeAllItems();

    let armor = pl.getArmor().getAllItems();
    for (let ar of armor) {
        if (!ar.isNull()) {
            if (!hasCurseofVanishing(ar)) {
                mc.spawnItem(ar, pl.pos);
            }
        }
    }
    pl.getArmor().removeAllItems();

    let offhandItem = pl.getOffHand();
    if (!hasCurseofVanishing(offhandItem)) {
        mc.spawnItem(offhandItem, pl.pos);
    }
    pl.clearItem(offhandItem.type);

    pl.refreshItems();
}

//??????????????????????????????????????????????????7????????????????????????????????????????????????100???????????????0????????????7???????????????????????????????????????
function DropExperience(pl) {
    if (pl.pos.dimid != 0) {
        return;//?????????????????????????????????????????????
    }

    let pos = pl.blockPos;

    let lvl = pl.getLevel();
    let drop = lvl * 7;
    pl.setTotalExperience(pl.getTotalExperience() - drop);
    for (let i = 0; i < drop && i < 100; i++) {
        mc.runcmdEx("summon xp_orb " + pos.x + " " + pos.y + " " + pos.z);
    }

}

function DropOnDeath(pl) {
    if (CheckHead(pl) > 0) {
        RemoveHead(pl);
        mc.broadcast(Format.Yellow + pl.name + " ?????????????????????,???????????????????????????!");
    }
    else {
        DropInventory(pl);
        DropExperience(pl);
    }
}

mc.listen("onPlayerDie", (pl, source) => {
    DropOnDeath(pl);
})

mc.listen("onServerStarted", () => {
    mc.runcmdEx("gamerule KeepInventory True");
})