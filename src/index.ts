import { save, save_r } from "./core/save";
import { load_script, save_script, save_and_commit_script, soft_delete_script, hard_delete_script } from "./core/script";
import { move, safeName } from "./core/move";
import { save_and_commit_all_events, save_and_commit_event, save_event } from "./core/save_event";
import { load } from "./core/load";
import { make_ts } from "./core/make_ts";
import { hash } from "./core/utils/hash";
import { normalize_code } from "./core/utils/normalize";
import { load_event } from "./core/load_event";
import { hard_delete_event, soft_delete_event } from "./core/delete_event";
import { hard_delete_template, soft_delete_template, hard_delete_room, soft_delete_room } from "./core/delete_template";
import { rename_event } from "./core/rename_event";
import { filename, make_path } from "./core/make_path";
import { ensure_dirs } from "./core/ensure_dirs";

const ctFiles = {
    hash,
    normalize_code,
    ensure_dirs,
    load_event,
    load,
    make_ts,
    make_path,
    filename,
    safeName,
    save_event,
    save_and_commit_event,
    save_and_commit_all_events,
    load_script,
    save_script,
    save_and_commit_script,
    rename_event,
    move,
    save,
    save_r,
    soft_delete_script,
    hard_delete_script,
    soft_delete_event,
    hard_delete_event,
    hard_delete_template,
    soft_delete_template,
    hard_delete_room,
    soft_delete_room
};

export default ctFiles;
