using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace Sage.AccountingKeyPayIntegrationPOC.Localization
{
    public static class AccountingKeyPayIntegrationPOCLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(AccountingKeyPayIntegrationPOCConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(AccountingKeyPayIntegrationPOCLocalizationConfigurer).GetAssembly(),
                        "Sage.AccountingKeyPayIntegrationPOC.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
