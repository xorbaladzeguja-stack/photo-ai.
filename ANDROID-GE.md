# PHOTO AI — Android-ზე გადატანის მომზადება

პროექტი ამჟამად არის React + TypeScript + Vite ვებ-აპლიკაცია. ეს ცვლილებები ამატებს Capacitor-ის კონფიგურაციას, რათა ვებ-აპლიკაცია Android აპლიკაციად შეიფუთოს.

## რა დაემატა
- `capacitor.config.ts` — Android კონფიგურაცია.
- Capacitor Core, Android და CLI დამოკიდებულებები.
- GitHub Actions workflow, რომელიც ღრუბელში ააწყობს სატესტო (debug) APK-ს.

## სატესტო APK-ის მიღება ტელეფონით
1. ZIP ატვირთე GitHub-ის ახალ, პირად რეპოზიტორიაში.
2. გახსენი Actions ჩანართი და გაუშვი `Build PHOTO AI Android APK` workflow (Run workflow), ან ცვლილებები push გააკეთე `main` branch-ზე.
3. დასრულებული workflow-ის გვერდზე, Artifacts განყოფილებაში ჩამოტვირთე `photo-ai-debug-apk`.
4. ZIP-იდან ამოიღე `app-debug.apk` და დააინსტალირე ტელეფონში.

## მნიშვნელოვანი
- ეს workflow ქმნის მხოლოდ სატესტო debug APK-ს. ეს ფაილი Google Play-ზე გამოსაქვეყნებლად არ გამოდგება.
- Google Play-სთვის საჭიროა release AAB, ხელმოწერა upload key-ით, უნიკალური application ID და Play Console-ის მოთხოვნების შესრულება. გასაღები არ ატვირთო GitHub-ში ან ZIP-ში.
- `com.photoai.georgia` დროებითი application ID-ია; გამოქვეყნებამდე უნდა დავრწმუნდეთ, რომ უნიკალურია და აღარ შევცვალოთ.
- არსებული ფოტოს დამუშავება შეიცავს კლიენტურ Canvas დემო-ეფექტებს. ეს ჯერ არ არის ნამდვილი AI გენერაცია. რეალური AI სერვისი უნდა დავუკავშიროთ დაცული backend-ის მეშვეობით; API გასაღები არ ჩაწერო აპის კოდში.
- შეამოწმე ფოტოს არჩევა, დამუშავება, შენახვა, წაშლა და ეკრანის ზომები ნამდვილ Android მოწყობილობაზე.

## ლოკალური build (როცა კომპიუტერი ხელმისაწვდომი იქნება)
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
