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
declare const ctFiles: {
    hash: typeof hash;
    normalize_code: typeof normalize_code;
    ensure_dirs: typeof ensure_dirs;
    load_event: typeof load_event;
    load: typeof load;
    make_ts: typeof make_ts;
    make_path: typeof make_path;
    filename: typeof filename;
    safeName: typeof safeName;
    save_event: typeof save_event;
    save_and_commit_event: typeof save_and_commit_event;
    save_and_commit_all_events: typeof save_and_commit_all_events;
    load_script: typeof load_script;
    save_script: typeof save_script;
    save_and_commit_script: typeof save_and_commit_script;
    rename_event: typeof rename_event;
    move: typeof move;
    save: typeof save;
    save_r: typeof save_r;
    soft_delete_script: typeof soft_delete_script;
    hard_delete_script: typeof hard_delete_script;
    soft_delete_event: typeof soft_delete_event;
    hard_delete_event: typeof hard_delete_event;
    hard_delete_template: typeof hard_delete_template;
    soft_delete_template: typeof soft_delete_template;
    hard_delete_room: typeof hard_delete_room;
    soft_delete_room: typeof soft_delete_room;
};
export default ctFiles;
